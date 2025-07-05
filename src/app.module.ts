import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecipientsModule } from './recipients/recipients.module';
import { PackagesModule } from './packages/packages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RecipientsModule,
    PackagesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
