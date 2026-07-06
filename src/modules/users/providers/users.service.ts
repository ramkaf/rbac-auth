import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { User } from "../../../databases/postgresql/entities/user.entity";
import { RedisService } from "@databases/redis/redis.service";
import { REDIS_INDEX_USERS } from "@databases/redis/redis.contants";
import { RoleService } from "@modules/rbac/providers/role.service";
import { AssignRoleToUserDto } from "../dtos/user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly roleService: RoleService,
  ) {}

  async create(data: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }
  async assignRoleToUser(dto: AssignRoleToUserDto): Promise<User> {
    const { roleUuid, userUuid } = dto;
    const user = await this.usersRepository.findOne({
      where: { id: dto.userUuid },
      relations: ["role"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const role = await this.roleService.findOne(roleUuid);

    if (!role) {
      throw new NotFoundException("Role not found");
    }

    user.role = role;

    const updatedUser = await this.usersRepository.save(user);
    await this.reIndexUsersIntoRedis()
    return updatedUser
  }
  async findWithRoleAndPermission() {
    let users = await this.redisService.getObj(REDIS_INDEX_USERS)
    if (!users){
      users =  await this.usersRepository.find({
      relations: {
        role: {
          permissions: true,
        },
      },
    });
    await this.reIndexUsersIntoRedis()
    }
    return users
  }

  async findOneWithRoleAndPermission(id: string) {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }

  async reIndexUsersIntoRedis() {
    const usersWithRoles = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .getMany();
    await this.redisService.setObj(REDIS_INDEX_USERS, usersWithRoles);
  }
}
