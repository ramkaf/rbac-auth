
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  CONTROLLER_PERMISSION_KEY,
  PERMISSIONS_KEY,
} from "../decorators/requires-permission.decorator";
import { UsersService } from "@modules/users/providers/users.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
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

  async hasPermission(context, controllerPermission, requiredPermissions) {
    if (!requiredPermissions && !controllerPermission) return true;
    const { user } = context.switchToHttp().getRequest();
    const cp = await this.userHavePermission(user.id, controllerPermission);
    const rp = await this.userHavePermission(user.id, requiredPermissions);

    if (controllerPermission && !requiredPermissions) return cp;
    if (!controllerPermission && requiredPermissions) return rp;
    if (controllerPermission && requiredPermissions) return cp || rp;
  }

  async userHavePermission(
    userId: string,
    permissionTitles?: string | string[],
  ): Promise<boolean> {
    const result = await this.userService.getUsersWithPermissions();
    if (permissionTitles == null) {
      return true;
    }
    const permissions = Array.isArray(permissionTitles)
      ? permissionTitles
      : [permissionTitles];

    if (permissions.length === 0 || permissions.every((p) => !p?.trim())) {
      return true;
    }

    const user = result.find((u) => u.id === userId);

    if (!user) {
      return false;
    }

    return permissions.every((required) =>
      user.role.permissions.some((permission) => permission.title === required),
    );
  }
}
