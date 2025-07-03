import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { CryptographyModule } from '@/cryptography/cryptography.module';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './infrastructure/http/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    CryptographyModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, LocalStrategy, JwtStrategy],
})
export class AuthModule { }