import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object'
import { InvalidZipCodeError } from '../errors/invalid-zip-code-error';

interface ZipCodeProps {
  value: string
}

export class ZipCode extends ValueObject<ZipCodeProps> {
  private static readonly ZIP_CODE_REGEX = /^\d{5}-\d{3}$/;

  get value(): string {
    return this.props.value
  }

  private constructor(props: ZipCodeProps) {
    super(props)
  }

  public static create(zipCode: string): Either<InvalidZipCodeError, ZipCode> {
    if (!ZipCode.ZIP_CODE_REGEX.test(zipCode)) {
      return left(new InvalidZipCodeError());
    }

    return right(new ZipCode({ value: zipCode }));
  }
}
