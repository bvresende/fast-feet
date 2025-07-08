import { Injectable } from '@nestjs/common';
import { Package } from '@/@domain/packages/package';
import { IPackageRepository } from '@/@domain/packages/package.interfaces';
import { PackagePrismaMapper } from './package.prisma.mapper';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PackageStatus } from '@prisma/client';

@Injectable()
export class PackagePrismaRepository implements IPackageRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(pkg: Package): Promise<void> {
    const data = PackagePrismaMapper.toPrisma(pkg);

    await this.prisma.package.create({ data });
  }

  async findById(id: string): Promise<Package | null> {
    const pkg = await this.prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return null;
    }

    return PackagePrismaMapper.toDomain(pkg);
  }

  async save(pkg: Package): Promise<void> {
    const data = PackagePrismaMapper.toPrisma(pkg);

    await this.prisma.package.update({
      where: { id: pkg.id.toString() },
      data,
    });
  }

  async findManyByCourierIdAndStatus(
    courierId: string,
    status: PackageStatus,
  ): Promise<Package[]> {
    const packagesDb = await this.prisma.package.findMany({
      where: {
        courierId,
        status,
      },
      orderBy: {
        deliveredAt: 'desc',
      },
    });

    return packagesDb.map(PackagePrismaMapper.toDomain);
  }
}