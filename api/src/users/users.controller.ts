import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: { user: unknown }) {
    return req.user;
  }
}
