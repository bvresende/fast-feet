import {
  Injectable,
  Inject,
} from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { Either, left, right } from '@/core/either';
import { UnauthorizedError } from './errors/user-unauthorized.error';
import { UseNotFoundError } from './errors/user-not-found.error';
import { ChangeUserPasswordDto } from '@/users/infrastructure/http/dtos/change-user-password.dto';
import { IncorrectPasswordError, SamePasswordError } from '@/@domain/users/user.errors';
import { UserInvalidCredentialsError } from './errors/user-invalid-credentials';
import { HashService } from '@/core/services/cryptography/hash-service';

interface ChangeUserPasswordUseCaseRequest extends ChangeUserPasswordDto {
  requestingUserId: string;
}

type ChangeUserPasswordUseCaseResponse = Either<
  UnauthorizedError | UseNotFoundError,
  null
>;

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
  ) { }

  async execute({
    requestingUserId,
    cpf,
    oldPassword,
    newPassword,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const requestingUser = await this.userRepository.findById(requestingUserId);

    if (!requestingUser) {
      return left(new UnauthorizedError());
    }

    if (requestingUser.role !== 'ADMIN') {
      return left(new UnauthorizedError());
    }

    const targetUser = await this.userRepository.findByCpf(cpf);

    if (!targetUser) {
      return left(new UseNotFoundError());
    }

    const result = await targetUser.changePassword({ oldPassword, newPassword, hashService: this.hashService });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case IncorrectPasswordError:
        case SamePasswordError:
          return left(new UserInvalidCredentialsError());
        default:
          return left(new UserInvalidCredentialsError());
      }
    }

    await this.userRepository.save(targetUser);

    return right(null);
  }
}