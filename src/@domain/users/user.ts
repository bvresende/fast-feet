import { Entity } from '../../core/entities/entity';
import { UniqueEntityID } from '../../core/entities/unique-entity-id';
import { Cpf } from '../shared/value-objects/cpf';

export type UserRole = 'ADMIN' | 'COURIER';

interface UserProps {
  name: string;
  cpf: Cpf;
  password: string;
  role: UserRole;
}

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

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);

    return user;
  }
}
