import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/providers/users.service";
import { SignupDto } from "./dto/signup.dto";
import { User } from "../../databases/postgresql/entities/user.entity";
import { RoleService } from "@modules/rbac/providers/role.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email already exists");
    }
    const role = await this.roleService.findByTitle("user");
    if (!role) throw new NotFoundException("role not found");
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role,
    });
    await this.usersService.reIndexUsersWithPermissionsIntoRedis()
    return this.buildResponse(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    return this.buildResponse(user);
  }

  private buildResponse(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
