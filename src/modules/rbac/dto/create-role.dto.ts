import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsUUID,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({
    example: "admin",
    description: "Role name (unique)",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Full system access",
  })
  @IsString()
  description?: string;
}

export class AssignPermissionsToRoleDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Role UUID",
  })
  @IsUUID()
  @IsNotEmpty()
  roleUuid: string;

  @ApiProperty({
    example: [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002",
    ],
    description: "Array of permission UUIDs",
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID("all", { each: true })
  permissionUuids: string[];
}
