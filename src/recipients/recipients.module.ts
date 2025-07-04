import { Module, Provider } from '@nestjs/common';
import { RECIPIENT_REPOSITORY } from '@/@domain/recipients/recipient.interfaces';
import { RecipientPrismaRepository } from './infrastructure/database/recipient.prisma.repository';
import { CreateRecipientUseCase } from './application/use-cases/create-recipient.use-case';
import { RecipientsController } from './infrastructure/http/recipients.controller';
import { UsersModule } from '@/users/users.module';
import { PrismaService } from '@/database/prisma/prisma.service';

const repositoryProvider: Provider = {
  provide: RECIPIENT_REPOSITORY,
  useClass: RecipientPrismaRepository,
};

@Module({
  imports: [UsersModule],
  controllers: [RecipientsController],
  providers: [CreateRecipientUseCase, repositoryProvider, PrismaService],
})
export class RecipientsModule { }