import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecipientsModule } from './recipients/recipients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RecipientsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
