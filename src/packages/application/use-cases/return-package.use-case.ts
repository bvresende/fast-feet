import { Injectable, Inject } from '@nestjs/common';
import { IPackageRepository, PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { Either, left, right } from '@/core/either';
import { ActionNotAllowedError } from './errors/action-not-allowed.error';
import { PackageNotFoundError } from './errors/package-not-found';

interface ReturnPackageUseCaseRequest {
  packageId: string;
}

type ReturnPackageUseCaseResponse = Either<
  PackageNotFoundError | ActionNotAllowedError,
  null
>;

@Injectable()
export class ReturnPackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
  ) { }

  async execute({
    packageId
  }: ReturnPackageUseCaseRequest): Promise<ReturnPackageUseCaseResponse> {
    const pkg = await this.packageRepository.findById(packageId);

    if (!pkg) {
      return left(new PackageNotFoundError());
    }

    const result = pkg.return();

    if (result.isLeft()) {
      return left(new ActionNotAllowedError());
    }

    await this.packageRepository.save(pkg);

    return right(null);
  }
}