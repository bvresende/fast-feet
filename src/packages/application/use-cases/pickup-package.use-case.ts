import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InvalidCourierError } from './errors/invalid-courier';
import { PackageNotFoundError } from './errors/package-not-found';
import { ActionNotAllowedError } from './errors/action-not-allowed.error';

interface PickupPackageUseCaseRequest {
  packageId: string;
  courierId: string;
}

type PickupPackageUseCaseResponse = Either<
  InvalidCourierError | PackageNotFoundError,
  null
>;

@Injectable()
export class PickupPackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute({
    packageId,
    courierId,
  }: PickupPackageUseCaseRequest): Promise<PickupPackageUseCaseResponse> {
    const courier = await this.userRepository.findById(courierId);

    if (!courier || courier.role !== 'COURIER') {
      return left(new InvalidCourierError());
    }

    const pkg = await this.packageRepository.findById(packageId);

    if (!pkg) {
      return left(new PackageNotFoundError());
    }

    const result = pkg.pickup(new UniqueEntityID(courierId));

    if (result.isLeft()) {
      return left(new ActionNotAllowedError());
    }

    await this.packageRepository.save(pkg);

    return right(null);
  }
}