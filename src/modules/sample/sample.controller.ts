import { Controller, Post, Get, Patch } from "@nestjs/common";
import {
  RequiresPermission,
} from "@modules/rbac/decorators/requires-permission.decorator";
import { Public } from "@modules/rbac/decorators/public.decorator";
import { ApiOperationWithDocs, Auth } from "document";
import {
  sample_MANAGEMENT_CREATE_PERMISSION,
} from "@modules/rbac/constants";
import { ApiTags } from "@nestjs/swagger";

// Grants access to all endpoints in this controller
// for users with the wildcard permission: "SAMPLE-management:*".
@Auth()
@ApiTags("sample")
@Controller("sample")
// @ControllerPermission(sample_MANAGEMENT_PERMISSION)
export class SampleController {
  constructor() {}

  // Requires explicit permission: "SAMPLE-management:create".
  @ApiOperationWithDocs("Create a sample resource (requires create permission)")
  @RequiresPermission(sample_MANAGEMENT_CREATE_PERMISSION)
  @Post()
  create() {
    return "Only users with 'SAMPLE-management:create' permission can access this endpoint.";
  }

  // Public endpoint - no authentication or permission required.
  @ApiOperationWithDocs("Public endpoint (no authentication required)")
  @Public()
  @Get()
  findAll() {
    return "This endpoint is public and can be accessed without authentication.";
  }

  // No method-level permission defined.
  // Access is inherited from controller-level wildcard permission ("SAMPLE-management:*").
  @ApiOperationWithDocs("Controller-level permission inherited endpoint")
  @Patch()
  SAMPLEControllerPermission() {
    return "Users with 'SAMPLE-management:*' permission can access this endpoint.";
  }
}
