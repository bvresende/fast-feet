import { Either, left, right } from '@/core/either';
import { ValueObject } from '@/core/entities/value-object';
import { InvalidCpfError } from '../errors/invalid-cpf-error';

export interface CpfProps {
  value: string;
}

export class Cpf extends ValueObject<CpfProps> {
  private static readonly CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: CpfProps) {
    super(props);
  }

  public static create(cpf: string): Either<InvalidCpfError, Cpf> {
    if (!Cpf.CPF_REGEX.test(cpf)) {
      return left(new InvalidCpfError());
    }

    return right(new Cpf({ value: cpf }));
  }
}
