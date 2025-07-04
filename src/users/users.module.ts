import { Module, Provider } from '@nestjs/common';
import { UsersController } from './infrastructure/http/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { UserPrismaRepository } from './infrastructure/database/user.prisma.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CryptographyModule } from '@/cryptography/cryptography.module';
import { ChangeUserPasswordUseCase } from './application/use-cases/change-user-password.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

const userRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useClass: UserPrismaRepository,
};

@Module({
  imports: [CryptographyModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    ChangeUserPasswordUseCase,
    DeleteUserUseCase,
    userRepositoryProvider,
    PrismaService,
  ],
  exports: [userRepositoryProvider],
})
export class UsersModule { }
