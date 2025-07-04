export class InvalidEmailError extends Error {
  constructor() {
    super('Email format is invalid');
    this.name = 'InvalidEmailError';
  }
}
