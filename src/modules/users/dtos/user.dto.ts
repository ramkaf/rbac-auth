import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AssignRoleToUserDto {
  @ApiProperty({
    example: "c2f8c3a0-1b2d-4c9a-9c2d-123456789abc",
    description: "User UUID",
  })
  @IsUUID()
  @IsNotEmpty()
  userUuid: string;

  @ApiProperty({
    example: "a1b2c3d4-1111-2222-3333-abcdefabcdef",
    description: "Role UUID",
  })
  @IsUUID()
  @IsNotEmpty()
  roleUuid: string;
}
