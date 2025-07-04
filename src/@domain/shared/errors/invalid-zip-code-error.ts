export class InvalidZipCodeError extends Error {
  constructor() {
    super('Zip code is invalid. Expected format: 00000-000');
    this.name = 'InvalidZipCodeError';
  }
}
