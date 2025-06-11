import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/database/database.service';

@Module({
  controllers: [],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
