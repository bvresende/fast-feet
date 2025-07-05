import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRecipientRepository, RECIPIENT_REPOSITORY } from '@/@domain/recipients/recipient.interfaces';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { IPackageRepository, PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { Package } from '@/@domain/packages/package';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { CreatePackageDto } from '../../infrastructure/http/dtos/create-package.dto';
import { RecipientNotFoundError } from './errors/recipient-not-found';

type CreatePackageResponse = Either<UnauthorizedError | NotFoundException, null>;

@Injectable()
export class CreatePackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(RECIPIENT_REPOSITORY)
    private readonly recipientRepository: IRecipientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(
    dto: CreatePackageDto,
    requestingUserId: string,
  ): Promise<CreatePackageResponse> {
    const requestingUser = await this.userRepository.findById(requestingUserId);

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      return left(new UnauthorizedError());
    }

    const recipient = await this.recipientRepository.findById(dto.recipientId);

    if (!recipient) {
      return left(new RecipientNotFoundError());
    }

    const pkg = Package.create({
      description: dto.description,
      recipientId: new UniqueEntityID(dto.recipientId),
    });

    await this.packageRepository.create(pkg);

    return right(null);
  }
}