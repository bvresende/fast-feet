import { Recipient } from './recipient';

export const RECIPIENT_REPOSITORY = 'RECIPIENT_REPOSITORY';

export interface IRecipientRepository {
  findByCpf(cpf: string): Promise<Recipient | null>;
  create(recipient: Recipient): Promise<void>;
}