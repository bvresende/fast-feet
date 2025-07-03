import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ConflictException,
  Patch,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { InvalidCpfError } from '@/@domain/shared/errors/invalid-cpf-error';
import { UserAlreadyExistsError } from '@/users/application/use-cases/errors/user-already-exists.error';
import { AuthGuard } from '@nestjs/passport';
import { ChangeUserPasswordDto } from './dtos/change-user-password.dto';
import { ChangeUserPasswordUseCase } from '@/users/application/use-cases/change-user-password.use-case';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { UseNotFoundError } from '@/users/application/use-cases/errors/user-not-found.error';
import { UserInvalidCredentialsError } from '@/users/application/use-cases/errors/user-invalid-credentials';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase,
  ) { }

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

  @Patch('/change-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Request() req,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
  ) {
    const requestingUserId = req.user.sub;

    const result = await this.changeUserPasswordUseCase.execute({
      ...changeUserPasswordDto,
      requestingUserId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UnauthorizedError:
        case UserInvalidCredentialsError:
          throw new UnauthorizedException(error.message);
        case UseNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
