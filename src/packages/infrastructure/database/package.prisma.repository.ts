import { Injectable } from '@nestjs/common';
import { Package } from '@/@domain/packages/package';
import { IPackageRepository } from '@/@domain/packages/package.interfaces';
import { PackagePrismaMapper } from './package.prisma.mapper';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PackagePrismaRepository implements IPackageRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(pkg: Package): Promise<void> {
    const data = PackagePrismaMapper.toPrisma(pkg);

    await this.prisma.package.create({ data });
  }
}