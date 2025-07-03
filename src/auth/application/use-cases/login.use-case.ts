import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { User } from '@/@domain/users/user';
import { HashService } from '@/core/services/cryptography/hash-service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Valida se as credenciais do usuário (CPF/senha) são válidas.
   * Retorna o usuário se for válido, ou null caso contrário.
   */
  async validateUser(cpf: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findByCpf(cpf);

    if (user) {
      const isPasswordMatching = await this.hashService.compare(
        pass,
        user.password,
      );

      if (isPasswordMatching) {
        return user;
      }
    }

    return null;
  }

  /**
   * Executa o login e gera o token de acesso.
   */
  async execute(user: User) {
    const payload = {
      sub: user.id.toString(),
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}