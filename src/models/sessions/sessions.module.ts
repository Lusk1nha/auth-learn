import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';

@Module({
  providers: [SessionsService, HashService, TokenService],
})
export class SessionsModule {}
