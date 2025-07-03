import { UseCaseError } from '@/core/errors/use-case-error';

export class UnauthorizedError extends Error implements UseCaseError {
  constructor() {
    super('Action allowed only for administrators');
    this.name = 'UnauthorizedError';
  }
}