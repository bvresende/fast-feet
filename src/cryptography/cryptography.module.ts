import { Module, Provider } from '@nestjs/common';

import { BcryptHasher } from './bcrypt-hasher';
import { HashService } from '@/core/services/cryptography/hash-service';

const hashServiceProvider: Provider = {
  provide: HashService,
  useClass: BcryptHasher,
};

@Module({
  providers: [hashServiceProvider],
  exports: [HashService],
})
export class CryptographyModule { }
