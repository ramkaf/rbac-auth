import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "user@demo.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456",
    description: "User password",
  })
  @IsNotEmpty()
  password: string;
}
