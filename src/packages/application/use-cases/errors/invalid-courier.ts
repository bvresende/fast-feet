import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidCourierError extends Error implements UseCaseError {
  constructor() {
    super('Invalid courier');
    this.name = 'InvalidCourierError';
  }
}
