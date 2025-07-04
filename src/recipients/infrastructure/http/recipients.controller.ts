import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecipientDto } from './dtos/create-recipient.dto';
import { CreateRecipientUseCase } from '../../application/use-cases/create-recipient.use-case';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { RecipientAlreadyExistsError } from '@/recipients/application/use-cases/errors/recipient-already-exists-error';
import { RecipientValidationError } from '@/recipients/application/use-cases/errors/recipient-validation-error';

@Controller('recipients')
@UseGuards(AuthGuard('jwt'))
export class RecipientsController {
  constructor(private readonly createRecipientUseCase: CreateRecipientUseCase) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() body: CreateRecipientDto) {
    const requestingUserId = req.user.sub;

    const result = await this.createRecipientUseCase.execute({
      ...body,
      ...requestingUserId
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof RecipientAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException(error.message);
      }

      if (error instanceof RecipientValidationError) {
        throw new ForbiddenException(error.message);
      }

      throw new BadRequestException();
    }
  }
}