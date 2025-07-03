import { DomainError } from '../shared/errors/domain-error';

export class IncorrectPasswordError extends DomainError {
  constructor() {
    super('The old password is incorrect')
  }
}

export class SamePasswordError extends DomainError {
  constructor() {
    super('The new password cannot be the same as the old one')
  }
}