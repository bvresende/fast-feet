import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { IRecipientRepository } from '@/@domain/recipients/recipient.interfaces';
import { Recipient } from '@/@domain/recipients/recipient';
import { RecipientPrismaMapper } from './recipient.prisma.mapper';

@Injectable()
export class RecipientPrismaRepository implements IRecipientRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { cpf },
    });

    if (!recipient) {
      return null;
    }

    return RecipientPrismaMapper.toDomain(recipient);
  }

  async create(recipient: Recipient): Promise<void> {
    const data = RecipientPrismaMapper.toPrisma(recipient);

    await this.prisma.recipient.create({ data });
  }
}