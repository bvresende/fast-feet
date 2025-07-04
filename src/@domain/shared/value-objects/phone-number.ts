import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { InvalidPhoneNumberError } from '../errors/invalid-phone-number-error';

export interface PhoneNumberProps {
  value: string;
}

export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  public static create(phone: string): Either<InvalidPhoneNumberError, PhoneNumber> {
    const digitsOnly = phone.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 11) {
      return left(new InvalidPhoneNumberError())
    }

    const formatted = `(${digitsOnly.substring(0, 2)}) ${digitsOnly.substring(2, 7)}-${digitsOnly.substring(7, 11)}`;

    return right(new PhoneNumber({ value: formatted }));
  }
}