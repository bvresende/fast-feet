import { Package as PrismaPackage, Prisma, PackageStatus } from '@prisma/client';
import {
  Package,
  PackageProps,
} from '@/@domain/packages/package';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PackagePrismaMapper {
  static toDomain(raw: PrismaPackage): Package {
    const props: PackageProps = {
      recipientId: new UniqueEntityID(raw.recipientId),
      description: raw.description,
      status: raw.status as PackageStatus,
      createdAt: raw.createdAt,
      courierId: raw.courierId ? new UniqueEntityID(raw.courierId) : null,
      pickedUpAt: raw.pickedUpAt,
      deliveredAt: raw.deliveredAt,
      returnedAt: raw.returnedAt,
      photoUrl: raw.photoUrl,
    };

    return Package.create(props, new UniqueEntityID(raw.id));
  }

  static toPrisma(pkg: Package): Prisma.PackageUncheckedCreateInput {
    return {
      id: pkg.id.toString(),
      recipientId: pkg.recipientId.toString(),
      description: pkg.description,
      status: pkg.status,
      createdAt: pkg.createdAt,
      courierId: pkg.courierId?.toString(),
      pickedUpAt: pkg.pickedUpAt,
      deliveredAt: pkg.deliveredAt,
      returnedAt: pkg.returnedAt,
      photoUrl: pkg.photoUrl,
    };
  }
}