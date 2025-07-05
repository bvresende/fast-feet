import { Package } from './package';

export const PACKAGE_REPOSITORY = 'PACKAGE_REPOSITORY';

export interface IPackageRepository {
  create(pkg: Package): Promise<void>;
}