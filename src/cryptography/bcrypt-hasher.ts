import { HashService } from '@/core/services/cryptography/hash-service';
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements HashService {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
