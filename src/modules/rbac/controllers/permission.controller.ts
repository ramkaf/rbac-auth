import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Get,
} from "@nestjs/common";
import { ApiGetOperationWithDocs, ApiOperationWithDocs, Auth } from "document";
import { PermissionService } from "../providers/permission.service";
import { ApiTags } from "@nestjs/swagger";

@Auth()
@ApiTags("permissions")
@Controller("permissions")
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiGetOperationWithDocs("Get all permissions with their permissions")
  findAll() {
    return this.permissionService.find();
  }
}
