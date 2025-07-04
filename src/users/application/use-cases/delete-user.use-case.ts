import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { Either, left, right } from '@/core/either';
import { UnauthorizedError } from './errors/user-unauthorized.error';
import { UserNotFoundError } from './errors/user-not-found.error';
import { UserCannotDeleteSelfError } from './errors/user-cannot-delete-self.error';

interface DeleteUserUseCaseRequest {
  requestingUserId: string;
  targetUserId: string;
}

type DeleteUserUseCaseResponse = Either<
  UnauthorizedError | UserNotFoundError | UserCannotDeleteSelfError,
  null
>;

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute({
    requestingUserId,
    targetUserId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const requestingUser = await this.userRepository.findById(requestingUserId);

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      return left(new UnauthorizedError());
    }

    if (requestingUserId === targetUserId) {
      return left(new UserCannotDeleteSelfError());
    }

    const targetUser = await this.userRepository.findById(targetUserId);

    if (!targetUser) {
      return left(new UserNotFoundError());
    }

    targetUser.delete();

    await this.userRepository.save(targetUser);

    return right(null);
  }
}