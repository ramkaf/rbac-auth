import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { PermissionSeeder } from "../seeds/permission.seed";
import { RoleSeeder } from "../seeds/role.seed";
import { UserSeeder } from "../seeds/user.seed";

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly userSeeder: UserSeeder,
  ) {}

  async onApplicationBootstrap() {
    await this.permissionSeeder.seed();
    await this.roleSeeder.seed();
    await this.userSeeder.seed();
  }
}
