import { ValueObject } from '@/core/entities/value-object';
import { ZipCode } from './zipCode';
import { Either, right } from '@/core/either';

export interface AddressProps {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: ZipCode;
  latitude?: number;
  longitude?: number;
}

export class Address extends ValueObject<AddressProps> {
  get street() { return this.props.street; }
  get number() { return this.props.number; }
  get complement() { return this.props.complement; }
  get neighborhood() { return this.props.neighborhood; }
  get city() { return this.props.city; }
  get state() { return this.props.state; }
  get zipCode() { return this.props.zipCode; }
  get latitude() { return this.props.latitude; }
  get longitude() { return this.props.longitude; }

  private constructor(props: AddressProps) {
    super(props);
  }

  public static create(props: AddressProps): Either<never, Address> {
    return right(new Address(props));
  }
}