import { Permission } from "@databases/postgresql/entities/permission.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async find() {
    return await this.permissionRepository.find();
  }
  async findByIds(ids: string[]): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
