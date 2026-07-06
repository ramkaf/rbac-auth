import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../databases/postgresql/entities/user.entity";
import { UsersService } from "./providers/users.service";
import { RbacModule } from "@modules/rbac/rbac.module";
import { UsersController } from "./controllers/user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RbacModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
