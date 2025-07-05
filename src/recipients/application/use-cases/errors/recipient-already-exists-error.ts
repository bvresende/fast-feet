import { UseCaseError } from '@/core/errors/use-case-error';

export class RecipientAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Recipient with this CPF already exists');
    this.name = 'RecipientAlreadyExistsError';
  }
}
