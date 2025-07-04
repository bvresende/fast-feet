import { UseCaseError } from '@/core/errors/use-case-error';

export class RecipientValidationError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message);
    this.name = 'RecipientValidationError';
  }
}
