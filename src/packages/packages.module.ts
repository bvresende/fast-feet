import { Module, Provider } from '@nestjs/common';
import { PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { PackagePrismaRepository } from './infrastructure/database/package.prisma.repository';
import { CreatePackageUseCase } from './application/use-cases/create-package.use-case';
import { PackagesController } from './infrastructure/http/packages.controller';
import { UsersModule } from '@/users/users.module';
import { RecipientsModule } from '@/recipients/recipients.module';
import { PrismaService } from '@/database/prisma/prisma.service';

const packageRepositoryProvider: Provider = {
  provide: PACKAGE_REPOSITORY,
  useClass: PackagePrismaRepository,
};

@Module({
  imports: [UsersModule, RecipientsModule],
  controllers: [PackagesController],
  providers: [CreatePackageUseCase, packageRepositoryProvider, PrismaService],
})
export class PackagesModule { }