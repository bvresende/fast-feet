import { Package } from '@/@domain/packages/package';

export class PackagePresenter {
  static toHTTP(pkg: Package) {
    return {
      id: pkg.id.toString(),
      description: pkg.description,
      status: pkg.status,
      deliveredAt: pkg.deliveredAt,
      photoUrl: pkg.photoUrl,
    };
  }
}