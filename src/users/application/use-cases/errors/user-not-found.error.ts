import { UseCaseError } from '@/core/errors/use-case-error';

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('User with this CPF was not found');
    this.name = 'UserNotFoundError';
  }
}
