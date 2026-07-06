import { Role } from "@databases/postgresql/entities/role.entity";
import { RedisService } from "@databases/redis/redis.service";
import { UsersService } from "@modules/users/providers/users.service";
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionService } from "./permission.service";
import { REDIS_INDEX_ROLE } from "@databases/redis/redis.contants";
import {
  AssignPermissionsToRoleDto,
  CreateRoleDto,
} from "../dto/create-role.dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private permissionService: PermissionService,
    private readonly redisService: RedisService,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { title: dto.title },
    });

    if (existingRole) {
      return existingRole;
    }

    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  async assignPermissionsToRole(
    assignPermissionsToRoleDto: AssignPermissionsToRoleDto,
  ): Promise<Role> {
    const { roleUuid, permissionUuids } = assignPermissionsToRoleDto;
    const role = await this.roleRepository.findOne({
      where: {
        id: roleUuid,
      },
    });
    if (!role) throw new BadRequestException("role not found");
    const permissions =
      await this.permissionService.findByUuids(permissionUuids);
    role.permissions = permissions;

    const assignedRole = await this.roleRepository.save(role);
    await this.reIndexAllRoleAndPermissionsIntoRedis();
    return assignedRole;
  }

  async findAllWithPermissions(): Promise<Role[]> {
    return await this.roleRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .getMany();
  }

  async findOne(id: string): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });
    return role;
  }

  async ensureRoleExist(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException("role not found");
    return role;
  }

  async findWithPermissions(id: string) {
    return await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
        permissions: true,
      },
    });
  }

  async reIndexAllRoleAndPermissionsIntoRedis() {
    const users = await this.findAllWithPermissions();
    await this.redisService.del(REDIS_INDEX_ROLE);
    await this.redisService.set(REDIS_INDEX_ROLE, JSON.stringify(users));
  }
  async findByTitle(title: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: {
        title,
      },
    });
  }
}
