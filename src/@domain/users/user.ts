import { Either, left, right } from '@/core/either';
import { Entity } from '../../core/entities/entity';
import { UniqueEntityID } from '../../core/entities/unique-entity-id';
import { Cpf } from '../shared/value-objects/cpf';
import { IncorrectPasswordError, SamePasswordError } from './user.errors';
import { HashService } from '@/core/services/cryptography/hash-service';

export type UserRole = 'ADMIN' | 'COURIER';

interface UserProps {
  name: string;
  cpf: Cpf;
  password: string;
  role: UserRole;
  deletedAt?: Date;
}

interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
  hashService: HashService
}

type ChangePasswordResponse = Either<
  IncorrectPasswordError | SamePasswordError,
  null
>;

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }

  get cpf(): Cpf {
    return this.props.cpf;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);

    return user;
  }

  public delete(): void {
    this.props.deletedAt = new Date();
  }

  async changePassword({
    oldPassword,
    newPassword,
    hashService,
  }: ChangePasswordParams): Promise<ChangePasswordResponse> {
    const isPasswordCorrect = await hashService.compare(
      oldPassword,
      this.props.password,
    );

    if (!isPasswordCorrect) {
      return left(new IncorrectPasswordError());
    }

    if (oldPassword === newPassword) {
      return left(new SamePasswordError());
    }

    this.props.password = await hashService.hash(newPassword);

    return right(null);
  }
}
