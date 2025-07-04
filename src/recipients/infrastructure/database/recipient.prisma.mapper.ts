import { Recipient as PrismaRecipient, Prisma } from '@prisma/client';
import { Recipient } from '@/@domain/recipients/recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from '@/@domain/shared/value-objects/cpf';
import { Email } from '@/@domain/shared/value-objects/email';
import { PhoneNumber } from '@/@domain/shared/value-objects/phone-number';
import { Address } from '@/@domain/shared/value-objects/address';
import { ZipCode } from '@/@domain/shared/value-objects/zipCode';
import { unwrap } from '@/core/helpers/unwrap';

export class RecipientPrismaMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    const cpf = unwrap(Cpf.create(raw.cpf));
    const email = unwrap(Email.create(raw.email));
    const phoneNumber = unwrap(PhoneNumber.create(raw.phoneNumber));
    const zipCode = unwrap(ZipCode.create(raw.zipCode));
    const address = unwrap(
      Address.create({
        street: raw.street,
        number: raw.number,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipCode,
        latitude: raw.latitude ?? undefined,
        longitude: raw.longitude ?? undefined,
      }),
    );

    return Recipient.create(
      {
        name: raw.name,
        cpf,
        email,
        phoneNumber,
        address,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    recipient: Recipient,
  ): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value,
      email: recipient.email.value,
      phoneNumber: recipient.phoneNumber.value,
      street: recipient.address.street,
      number: recipient.address.number,
      complement: recipient.address.complement,
      neighborhood: recipient.address.neighborhood,
      city: recipient.address.city,
      state: recipient.address.state,
      zipCode: recipient.address.zipCode.value,
      latitude: recipient.address.latitude,
      longitude: recipient.address.longitude,
    };
  }
}