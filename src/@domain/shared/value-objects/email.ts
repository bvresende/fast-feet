import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { InvalidEmailError } from '../errors/invalid-email.error';

export interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (!Email.EMAIL_REGEX.test(email)) {
      return left(new InvalidEmailError());
    }

    return right(new Email({ value: email.toLowerCase() }));
  }
}