import { User } from './user';
export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByCpf(cpf: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<void>;
  save(user: User): Promise<void>;
}
