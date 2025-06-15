import * as Joi from 'joi';
import configuration from '../common/configuration/configuration.common';

import { Module } from '@nestjs/common';

import { UsersModule } from '../models/users/users.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../common/database/database.service';
import { CredentialsModule } from '../models/credentials/credentials.module';
import { PasswordModule } from 'src/models/password/password.module';
import { AuthModule } from 'src/models/auth/auth.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { HashModule } from 'src/models/hash/hash.module';
import { TokenModule } from 'src/models/token/token.module';

const validationSchema = Joi.object({
  APP_PORT: Joi.number().integer().positive().default(3000),
  DATABASE_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema,
    }),

    UsersModule,
    CredentialsModule,
    PasswordModule,
    AuthModule,
    SessionsModule,
    HashModule,
    TokenModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
