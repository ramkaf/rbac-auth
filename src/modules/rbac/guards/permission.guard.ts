import { Role } from "@databases/postgresql/entities/role.entity";
import { REDIS_INDEX_ROLE } from "@databases/redis/redis.contants";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  CONTROLLER_PERMISSION_KEY,
  PERMISSIONS_KEY,
} from "../decorators/requires-permission.decorator";
import { RoleService } from "../providers/role.service";
import { UsersService } from "@modules/users/providers/users.service";
import { RedisService } from "@databases/redis/redis.service";
import { IPermission } from "../interfaces/rbac.interface";
import { log } from "node:console";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const controllerPermission = this.reflector.get<string>(
      CONTROLLER_PERMISSION_KEY,
      context.getClass(),
    );

    const result = await this.hasPermission(
      context,
      controllerPermission,
      requiredPermissions,
    );
    return result;
  }

  async getUserPermissions(context): Promise<IPermission[]> {
    const { user } = context.switchToHttp().getRequest();
    let roleWithPermissions;
    const permissionsJsonString = await this.redisService.get(REDIS_INDEX_ROLE);
    if (permissionsJsonString)
      roleWithPermissions = JSON.parse(permissionsJsonString);
    else {
      roleWithPermissions = await this.roleService.findAllWithPermissions();
      await this.redisService.set(
        REDIS_INDEX_ROLE,
        JSON.stringify(roleWithPermissions),
      );
    }
    const users = await this.userService.findWithRoleAndPermission();
    const userObj = users.find((item) => item.id === user.id);

    if (!userObj) throw new BadRequestException("user not found");
    const userPermissions = roleWithPermissions.find(
      (item: Role) => item.id === userObj.role.id,
    ).permissions;
    return userPermissions;
  }
  async hasPermission(context, controllerPermission, requiredPermissions) {
    if (!requiredPermissions && !controllerPermission) return true;
    const userPermissions = await this.getUserPermissions(context);
    console.log({ userPermissions, requiredPermissions, controllerPermission });

    if (userPermissions.length === 0) return false;
    const cp = this.checkControllerPermissionAccessability(
      userPermissions,
      controllerPermission,
    );
    const rp = this.checkRequiredPermissionAccessability(
      userPermissions,
      requiredPermissions,
    );

    return cp || rp;
  }
  private checkRequiredPermissionAccessability(
    userPermissions,
    requiredPermissions,
  ): boolean {
    if (!requiredPermissions || userPermissions.length === 0) return true;
    return requiredPermissions.every((permission) =>
      userPermissions.some((userPerm) => userPerm.title === permission),
    );
  }
  private checkControllerPermissionAccessability(
    userPermissions,
    controllerPermission,
  ): boolean {
    if (!controllerPermission) return false;
    const hasControllerPermission = userPermissions.some(
      (permission) => permission.title === `${controllerPermission}:*`,
    );
    if (hasControllerPermission) return true;
    return false;
  }
}
