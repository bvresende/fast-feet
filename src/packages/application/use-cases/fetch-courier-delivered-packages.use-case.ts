import { Injectable, Inject } from '@nestjs/common';
import { Package } from '@/@domain/packages/package';
import { Either, right } from '@/core/either';
import { IPackageRepository, PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { PackageStatus } from '@prisma/client';

interface FetchCourierDeliveredPackagesUseCaseRequest {
  courierId: string;
}

type FetchCourierDeliveredPackagesUseCaseResponse = Either<never, Package[]>;

@Injectable()
export class FetchCourierDeliveredPackagesUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
  ) { }

  async execute({
    courierId,
  }: FetchCourierDeliveredPackagesUseCaseRequest): Promise<FetchCourierDeliveredPackagesUseCaseResponse> {
    const packages =
      await this.packageRepository.findManyByCourierIdAndStatus(
        courierId,
        PackageStatus.DELIVERED,
      );

    return right(packages);
  }
}