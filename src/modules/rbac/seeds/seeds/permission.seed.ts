import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { Permission } from "@databases/postgresql/entities/permission.entity";

@Injectable()
export class PermissionSeeder {
  private readonly PERMISSION_PATH = path.join(
    process.cwd(),
    "src/modules/rbac/constants",
  );

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async seed() {
    const files = fs
      .readdirSync(this.PERMISSION_PATH)
      .filter((f) => f.endsWith(".permission.ts"));

    const permissions: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(
        path.join(this.PERMISSION_PATH, file),
        "utf-8",
      );

      const regex = /export\s+const\s+\w+\s*=\s*['"`]([^'"`]+)['"`]/g;

      let match;
      while ((match = regex.exec(content)) !== null) {
        permissions.push(match[1]);
      }
    }

    const unique = [...new Set(permissions)];

    for (const title of unique) {
      const exists = await this.permissionRepo.findOne({ where: { title } });

      if (exists) continue;

      const category = title.split(":")[0];

      await this.permissionRepo.save(
        this.permissionRepo.create({
          title,
          category,
          description: title,
        }),
      );
    }
  }
}
