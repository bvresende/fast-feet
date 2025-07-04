export class InvalidPhoneNumberError extends Error {
  constructor() {
    super('Phone number is invalid. The expected format should contain 11 numbers, with the area code');
    this.name = 'InvalidPhoneNumberError';
  }
}
