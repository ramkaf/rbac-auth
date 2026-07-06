import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Get,
} from "@nestjs/common";
import {
  CreateRoleDto,
  AssignPermissionsToRoleDto,
} from "../dto/create-role.dto";
import { RoleService } from "../providers/role.service";
import { ApiGetOperationWithDocs, ApiOperationWithDocs, Auth } from "document";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("roles")
@Controller("roles")
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperationWithDocs("Create a new role without assigning permissions")
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperationWithDocs("Assign or remove permissions from a role")
  assignPermissions(@Body() dto: AssignPermissionsToRoleDto) {
    return this.roleService.assignPermissionsToRole(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiGetOperationWithDocs("Get all roles with their permissions")
  findAll() {
    return this.roleService.findAllWithPermissions();
  }
}
