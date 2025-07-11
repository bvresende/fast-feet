import { Module, Provider } from '@nestjs/common';
import { PACKAGE_REPOSITORY } from '@/@domain/packages/package.interfaces';
import { PackagePrismaRepository } from './infrastructure/database/package.prisma.repository';
import { CreatePackageUseCase } from './application/use-cases/create-package.use-case';
import { PackagesController } from './infrastructure/http/packages.controller';
import { UsersModule } from '@/users/users.module';
import { RecipientsModule } from '@/recipients/recipients.module';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PickupPackageUseCase } from './application/use-cases/pickup-package.use-case';
import { DeliverPackageUseCase } from './application/use-cases/deliver-package.use-case';
import { ReturnPackageUseCase } from './application/use-cases/return-package.use-case';
import { FetchCourierDeliveredPackagesUseCase } from './application/use-cases/fetch-courier-delivered-packages.use-case';
import { NotifyRecipientOnPackageStatusChangedSubscriber } from './application/subscribers/notify-recipient-on-package-status-changed.subscriber';

const packageRepositoryProvider: Provider = {
  provide: PACKAGE_REPOSITORY,
  useClass: PackagePrismaRepository,
};

@Module({
  imports: [
    UsersModule,
    RecipientsModule
  ],
  controllers: [PackagesController],
  providers: [
    CreatePackageUseCase,
    PickupPackageUseCase,
    DeliverPackageUseCase,
    ReturnPackageUseCase,
    FetchCourierDeliveredPackagesUseCase,
    NotifyRecipientOnPackageStatusChangedSubscriber,
    packageRepositoryProvider,
    PrismaService
  ],
})
export class PackagesModule { }