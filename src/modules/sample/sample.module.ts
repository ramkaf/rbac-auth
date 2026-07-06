import { Module } from "@nestjs/common";
import { SampleController } from "./sample.controller";
import { PermissionGuard } from "@modules/rbac/guards/permission.guard";
import { APP_GUARD } from "@nestjs/core";
import { RbacModule } from "@modules/rbac/rbac.module";
import { UsersModule } from "@modules/users/users.module";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";

@Module({
  imports: [RbacModule, UsersModule],
  controllers: [SampleController],
  providers: [
    {
      useClass: JwtAuthGuard,
      provide: APP_GUARD,
    },
    {
      useClass: PermissionGuard,
      provide: APP_GUARD,
    },
  ],
})
export class SampleModule {}
