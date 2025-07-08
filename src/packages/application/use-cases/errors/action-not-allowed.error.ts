import { UseCaseError } from '@/core/errors/use-case-error';

export class ActionNotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Action not allowed');
    this.name = 'ActionNotAllowedError';
  }
}
