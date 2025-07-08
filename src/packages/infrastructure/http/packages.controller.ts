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
  Patch,
  Param,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePackageDto } from './dtos/create-package.dto';
import { CreatePackageUseCase } from '../../application/use-cases/create-package.use-case';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { RecipientNotFoundError } from '@/packages/application/use-cases/errors/recipient-not-found';
import { PickupPackageUseCase } from '@/packages/application/use-cases/pickup-package.use-case';
import { InvalidCourierError } from '@/packages/application/use-cases/errors/invalid-courier';
import { PackageNotFoundError } from '@/packages/application/use-cases/errors/package-not-found';
import { ActionNotAllowedError } from '@/packages/application/use-cases/errors/action-not-allowed.error';
import { DeliverPackageUseCase } from '@/packages/application/use-cases/deliver-package.use-case';
import { DeliverPackageDto } from './dtos/deliver-package.dto';

@Controller('packages')
@UseGuards(AuthGuard('jwt'))
export class PackagesController {
  constructor(
    private readonly createPackageUseCase: CreatePackageUseCase,
    private readonly pickupPackageUseCase: PickupPackageUseCase,
    private readonly deliverPackageUseCase: DeliverPackageUseCase,
  ) { }

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

  @Patch(':id/pickup')
  @HttpCode(HttpStatus.NO_CONTENT)
  async pickup(@Request() req, @Param('id') packageId: string) {
    const courierId = req.user.sub;

    const result = await this.pickupPackageUseCase.execute({
      packageId,
      courierId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCourierError:
          throw new ConflictException(error.message);
        case PackageNotFoundError:
          throw new NotFoundException(error.message);
        case ActionNotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }

  @Patch(':id/deliver')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deliver(
    @Request() req,
    @Param('id') packageId: string,
    @Body() body: DeliverPackageDto,
  ) {
    const courierId = req.user.sub;

    const result = await this.deliverPackageUseCase.execute({
      packageId,
      courierId,
      photoUrl: body.photoUrl,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PackageNotFoundError:
          throw new NotFoundException(error.message);
        case ActionNotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}