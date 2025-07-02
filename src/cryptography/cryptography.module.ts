import { Module, Provider } from '@nestjs/common';

import { BcryptHasher } from './bcrypt-hasher';
import { HashComparer } from '@/core/services/cryptography/hash-comparer';
import { HashGenerator } from '@/core/services/cryptography/hash-generator';

const hashComparerProvider: Provider = {
  provide: HashComparer,
  useClass: BcryptHasher,
};

const hashGeneratorProvider: Provider = {
  provide: HashGenerator,
  useClass: BcryptHasher,
};

@Module({
  providers: [hashComparerProvider, hashGeneratorProvider],
  exports: [HashComparer, HashGenerator],
})
export class CryptographyModule {}
