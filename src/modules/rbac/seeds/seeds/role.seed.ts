import { Permission } from "@databases/postgresql/entities/permission.entity";
import { Role } from "@databases/postgresql/entities/role.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const allPermissions = await this.permissionRepo.find();

    const adminExists = await this.roleRepo.findOne({
      where: { title: "admin" },
    });

    if (!adminExists) {
      const adminRole = this.roleRepo.create({
        title: "admin",
        description: "Full access role",
        permissions: allPermissions,
      });

      await this.roleRepo.save(adminRole);
    }

    const userExists = await this.roleRepo.findOne({
      where: { title: "user" },
    });

    if (!userExists) {
      const userRole = this.roleRepo.create({
        title: "user",
        description: "Limited access role",
        permissions: [],
      });

      await this.roleRepo.save(userRole);
    }
  }
}
