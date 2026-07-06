import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "@databases/postgresql/entities/role.entity";
import { Permission } from "@databases/postgresql/entities/permission.entity";
import { UsersModule } from "@modules/users/users.module";
import { SeederService } from "./seeds/providers/seeder.service";
import { PermissionSeeder } from "./seeds/seeds/permission.seed";
import { RoleSeeder } from "./seeds/seeds/role.seed";
import { UserSeeder } from "./seeds/seeds/user.seed";
import { User } from "@databases/postgresql/entities/user.entity";
import { RoleService } from "./providers/role.service";
import { PermissionService } from "./providers/permission.service";
import { RolesController } from "./controllers/role.controller";
import { PermissionsController } from "./controllers/permission.controller";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [RolesController, PermissionsController],
  providers: [
    RoleService,
    PermissionService,
    SeederService,
    PermissionSeeder,
    RoleSeeder,
    UserSeeder,
  ],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
