export class InvalidCpfError extends Error {
  constructor() {
    super('CPF is invalid. Expected format: 000.000.000-00');
    this.name = 'InvalidCpfError';
  }
}
