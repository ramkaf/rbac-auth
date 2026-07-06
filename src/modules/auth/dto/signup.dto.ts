import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({
    example: "John",
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "Doe",
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "user@demo.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "123456",
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
