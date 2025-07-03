import { Prisma, User as PrismaUser } from '@prisma/client';
import { User } from '@/@domain/users/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from '@/@domain/shared/value-objects/cpf';
import { InvalidCpfError } from '@/@domain/shared/errors/invalid-cpf-error';

export class UserPrismaMapper {
  /**
   * Converte um objeto de usuário retornado pelo Prisma para uma entidade de domínio.
   * @param raw - O objeto de usuário do Prisma.
   * @returns Uma instância da classe User (entidade de domínio).
   */
  static toDomain(raw: PrismaUser): User {
    const cpfOrError = Cpf.create(raw.cpf);

    if (cpfOrError.isLeft()) { // cpf no formato inválido no banco de dados
      throw new InvalidCpfError();
    }

    const cpf = cpfOrError.value;
    return User.create(
      {
        name: raw.name,
        password: raw.password,
        cpf,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    );
  }

  /**
   * Converte uma entidade de domínio User para o formato de dados que o Prisma espera
   * para criar um novo registro.
   * @param user - A instância da entidade de domínio User.
   * @returns Um objeto no formato Prisma.UserUncheckedCreateInput.
   */
  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf.value,
      password: user.password,
      role: user.role,
    };
  }
}
