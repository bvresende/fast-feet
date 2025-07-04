import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Cpf } from '../shared/value-objects/cpf';
import { Email } from '../shared/value-objects/email';
import { PhoneNumber } from '../shared/value-objects/phone-number';
import { Address } from '../shared/value-objects/address';

export interface RecipientProps {
  name: string;
  cpf: Cpf;
  phoneNumber: PhoneNumber;
  email: Email;
  address: Address;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  get email() {
    return this.props.email;
  }

  get address() {
    return this.props.address;
  }

  public static create(props: RecipientProps, id?: UniqueEntityID) {
    const recipient = new Recipient(props, id);

    return recipient;
  }
}