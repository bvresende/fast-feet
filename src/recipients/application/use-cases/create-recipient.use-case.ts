import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IRecipientRepository, RECIPIENT_REPOSITORY } from '@/@domain/recipients/recipient.interfaces';
import { CreateRecipientDto } from '../../infrastructure/http/dtos/create-recipient.dto';
import { Recipient } from '@/@domain/recipients/recipient';
import { Cpf } from '@/@domain/shared/value-objects/cpf';
import { Email } from '@/@domain/shared/value-objects/email';
import { PhoneNumber } from '@/@domain/shared/value-objects/phone-number';
import { Address } from '@/@domain/shared/value-objects/address';
import { IUserRepository, USER_REPOSITORY } from '@/@domain/users/user.interfaces';
import { UnauthorizedError } from '@/users/application/use-cases/errors/user-unauthorized.error';
import { Either, left, right } from '@/core/either';
import { RecipientValidationError } from './errors/recipient-validation-error';
import { ZipCode } from '@/@domain/shared/value-objects/zipCode';
import { unwrap } from '@/core/helpers/unwrap';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error';

interface CreateRecipientUseCaseRequest extends CreateRecipientDto {
  requestingUserId: string;
}

type CreateRecipientResponse = Either<UnauthorizedError | RecipientAlreadyExistsError | RecipientValidationError, null>;

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    @Inject(RECIPIENT_REPOSITORY)
    private readonly recipientRepository: IRecipientRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(createRecipientRequest: CreateRecipientUseCaseRequest): Promise<CreateRecipientResponse> {
    const requestingUser = await this.userRepository.findById(createRecipientRequest.requestingUserId);

    if (!requestingUser || requestingUser.role !== 'ADMIN') {
      return left(new UnauthorizedError());
    }

    const recipientExists = await this.recipientRepository.findByCpf(createRecipientRequest.cpf);

    if (recipientExists) {
      return left(new RecipientAlreadyExistsError());
    }

    try {
      const cpf = unwrap(Cpf.create(createRecipientRequest.cpf));
      const email = unwrap(Email.create(createRecipientRequest.email));
      const phoneNumber = unwrap(PhoneNumber.create(createRecipientRequest.phoneNumber));

      const zipCode = unwrap(ZipCode.create(createRecipientRequest.address.zipCode));
      const address = unwrap(
        Address.create({
          street: createRecipientRequest.address.street,
          number: createRecipientRequest.address.number,
          complement: createRecipientRequest.address.complement,
          neighborhood: createRecipientRequest.address.neighborhood,
          city: createRecipientRequest.address.city,
          state: createRecipientRequest.address.state,
          zipCode: zipCode,
          latitude: createRecipientRequest.address.latitude,
          longitude: createRecipientRequest.address.longitude,
        }),
      );

      const recipient = Recipient.create({
        name: createRecipientRequest.name,
        cpf,
        email,
        phoneNumber,
        address,
      });

      await this.recipientRepository.create(recipient);

      return right(null);
    } catch (error) {
      if (error instanceof Error) {
        return left(new RecipientValidationError(error.message));
      }

      return left(new RecipientValidationError('Ocorreu um erro inesperado.'));
    }
  }
}