import { UseCaseError } from '@/core/errors/use-case-error';

export class UserCannotDeleteSelfError extends Error implements UseCaseError {
  constructor() {
    super('User cannot delete themselves');
    this.name = 'UserCannotDeleteSelfError';
  }
}
