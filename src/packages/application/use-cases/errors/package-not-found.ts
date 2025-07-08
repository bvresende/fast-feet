import { UseCaseError } from '@/core/errors/use-case-error';

export class PackageNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Package not found');
    this.name = 'PackageNotFoundError';
  }
}
