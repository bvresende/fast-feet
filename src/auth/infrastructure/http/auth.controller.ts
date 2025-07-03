import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.loginUseCase.execute(req.user);
  }
}