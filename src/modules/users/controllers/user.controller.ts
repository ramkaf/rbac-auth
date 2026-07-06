import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "../providers/users.service";
import { ApiOperationWithDocs, Auth } from "document";
import { AssignRoleToUserDto } from "../dtos/user.dto";
import { ApiTags } from "@nestjs/swagger";
import {
  ControllerPermission,
  RequiresPermission,
} from "@modules/rbac/decorators/requires-permission.decorator";
import {
  USER_PERMISSION,
  USER_READ_PERMISSION,
  USER_UPDATE_PERMISSION,
} from "@modules/rbac/constants";

@Auth()
@ApiTags("user managment")
@ControllerPermission(USER_PERMISSION)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiresPermission(USER_READ_PERMISSION)
  @ApiOperationWithDocs("Fetch users with role and their permissions")
  findWithRoleAndPermissions() {
    return this.usersService.getUsersWithPermissions();
  }

  @Patch("assign-role")
  @RequiresPermission(USER_UPDATE_PERMISSION)
  @ApiOperationWithDocs("Assign a role to a user")
  assignRole(@Body() dto: AssignRoleToUserDto) {
    return this.usersService.assignRoleToUser(dto);
  }
}
