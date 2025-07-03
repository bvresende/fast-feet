import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '@/@domain/users/user.interfaces';
import { User } from '@/@domain/users/user';
import { Cpf } from '@/@domain/shared/value-objects/cpf';
import { Either, left, right } from '@/core/either';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { HashService } from '@/core/services/cryptography/hash-service';

interface CreateUserUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
  ) { }

  async execute({
    name,
    cpf,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const cpfOrError = Cpf.create(cpf);

    if (cpfOrError.isLeft()) {
      return left(cpfOrError.value);
    }

    const cpfValue = cpfOrError.value;

    const userExists = await this.userRepository.findByCpf(cpf);

    if (userExists) {
      return left(new UserAlreadyExistsError());
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = User.create({
      name,
      cpf: cpfValue,
      password: hashedPassword,
      role: 'COURIER',
    });

    await this.userRepository.create(user);

    return right({ user });
  }
}
