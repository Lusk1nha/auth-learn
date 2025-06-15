import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PasswordService } from '../password/password.service';
import { PrismaService } from 'src/common/database/database.service';
import { AuthController } from './auth.controller';
import { SessionsService } from '../sessions/sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    CredentialsService,
    PasswordService,
    PrismaService,
    SessionsService,
    HashService,
    TokenService
  ],
})
export class AuthModule {}
