import { PackageStatus } from '@prisma/client';
import { Package } from './package';

export const PACKAGE_REPOSITORY = 'PACKAGE_REPOSITORY';

export interface IPackageRepository {
  create(pkg: Package): Promise<void>;
  findById(id: string): Promise<Package | null>;
  save(pkg: Package): Promise<void>;
  findManyByCourierIdAndStatus(
    courierId: string,
    status: PackageStatus,
  ): Promise<Package[]>;
}