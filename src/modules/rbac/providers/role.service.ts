import { Role } from "@databases/postgresql/entities/role.entity";
import { UsersService } from "@modules/users/providers/users.service";
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionService } from "./permission.service";
import {
  AssignPermissionsToRoleDto,
  CreateRoleDto,
} from "../dto/create-role.dto";
import { IRole } from "../interfaces/rbac.interface";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private permissionService: PermissionService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const { title } = dto;
    const existingRole = await this.findByTitle(title);

    if (existingRole) {
      return existingRole;
    }

    const roleSchema = this.roleRepository.create(dto);
    const role = await this.roleRepository.save(roleSchema);
    await this.userService.reIndexUsersWithPermissionsIntoRedis();
    return role;
  }
  async findOne(id: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });
  }
  async findByTitle(title: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: {
        title,
      },
    });
  }

  async findAllWithPermissions(): Promise<IRole[]> {
    return await this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });
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
      await this.permissionService.findByIds(permissionUuids);
    role.permissions = permissions;
    const assignedRole = await this.roleRepository.save(role);
    await this.userService.reIndexUsersWithPermissionsIntoRedis();
    return assignedRole;
  }
}
