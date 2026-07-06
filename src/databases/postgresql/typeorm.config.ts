import { User } from "src/databases/postgresql/entities/user.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Permission, Role],
  synchronize: true,
  autoLoadEntities: true,
});
