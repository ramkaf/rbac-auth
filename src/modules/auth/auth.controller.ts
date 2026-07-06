import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "../../databases/postgresql/entities/user.entity";
import { Public } from "@modules/rbac/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: { user: User }, @Body() _dto: LoginDto) {
    return this.authService.login(req.user);
  }
}
