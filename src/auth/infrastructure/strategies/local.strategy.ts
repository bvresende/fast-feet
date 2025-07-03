import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({ usernameField: 'cpf' });
  }

  async validate(cpf: string, password: string): Promise<any> {
    const user = await this.loginUseCase.validateUser(cpf, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}