import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { HashService } from '../hash/hash.service';

@Module({
  providers: [SessionsService, HashService],
})
export class SessionsModule {}
