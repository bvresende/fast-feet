import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { IUserRepository } from '@/@domain/users/user.interfaces';
import { User } from '@/@domain/users/user';
import { UserPrismaMapper } from './user.prisma.mapper';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!user) {
      return null;
    }

    return UserPrismaMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return UserPrismaMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = UserPrismaMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = UserPrismaMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }
}
