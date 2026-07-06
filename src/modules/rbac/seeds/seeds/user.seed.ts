import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@databases/postgresql/entities/user.entity";
import { Role } from "@databases/postgresql/entities/role.entity";

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async seed() {
    const count = await this.userRepo.count();
    if (count > 0) return;

    const adminRole = await this.roleRepo.findOne({
      where: { title: "admin" },
    });

    const userRole = await this.roleRepo.findOne({
      where: { title: "user" },
    });

    const password = await bcrypt.hash("123456", 10);

    await this.userRepo.save([
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@demo.com",
        password,
        role: adminRole,
      },
      {
        firstName: "Normal",
        lastName: "User",
        email: "user@demo.com",
        password,
        role: userRole,
      },
    ]);
  }
}
