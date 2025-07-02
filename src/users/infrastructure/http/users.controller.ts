import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { InvalidCpfError } from '@/@domain/shared/errors/invalid-cpf-error';
import { UserAlreadyExistsError } from '@/users/application/use-cases/errors/user-already-exists.error';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.createUserUseCase.execute(createUserDto);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCpfError:
          throw new ConflictException(error.message);
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
