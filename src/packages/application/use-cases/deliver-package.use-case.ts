import { Injectable, Inject } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from './errors/action-not-allowed.error';
import { PackageNotFoundError } from './errors/package-not-found';

interface DeliverPackageUseCaseRequest {
  packageId: string;
  courierId: string;
  photoUrl: string;
}

type DeliverPackageUseCaseResponse = Either<
  PackageNotFoundError | ActionNotAllowedError,
  null
>;

@Injectable()
export class DeliverPackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
  ) { }

  async execute({
    packageId,
    courierId,
    photoUrl,
  }: DeliverPackageUseCaseRequest): Promise<DeliverPackageUseCaseResponse> {
    const pkg = await this.packageRepository.findById(packageId);

    if (!pkg) {
      return left(new PackageNotFoundError());
    }

    const result = pkg.deliver(photoUrl, new UniqueEntityID(courierId));

    if (result.isLeft()) {
      return left(new ActionNotAllowedError());
    }

    await this.packageRepository.save(pkg);

    return right(null);
  }
}