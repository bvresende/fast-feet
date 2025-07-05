import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePackageDto } from './dtos/create-package.dto';
import { CreatePackageUseCase } from '../../application/use-cases/create-package.use-case';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { RecipientNotFoundError } from '@/packages/application/use-cases/errors/recipient-not-found';

@Controller('packages')
@UseGuards(AuthGuard('jwt'))
export class PackagesController {
  constructor(private readonly createPackageUseCase: CreatePackageUseCase) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() body: CreatePackageDto) {
    const requestingUserId = req.user.sub;

    const result = await this.createPackageUseCase.execute(
      body,
      requestingUserId,
    );

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }

      if (error instanceof RecipientNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException();
    }
  }
}