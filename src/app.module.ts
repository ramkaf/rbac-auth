import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./databases/postgresql/typeorm.config";
import { UsersModule } from "@modules/users/users.module";
import { AuthModule } from "@modules/auth/auth.module";
import { RedisModule } from "@databases/redis/redis.module";
import { RbacModule } from "./modules/rbac/rbac.module";
import { SampleModule } from "./modules/sample/sample.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: typeOrmConfig }),
    UsersModule,
    AuthModule,
    RedisModule,
    RbacModule,
    SampleModule,
  ],
})
export class AppModule {}
