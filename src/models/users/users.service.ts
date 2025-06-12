import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/common/database/database.service';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';

import { UserAlreadyExistsException } from './users.errors';
import { UserEntity } from './domain/user.entity';
import { UserMapper } from './domain/user.mapper';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: EmailAddress): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    this.logger.log(`Found user with email=${email.value}`);
    return UserMapper.toDomain(user);
  }

  async createUser(
    user: UserEntity,
    tx?: PrismaTransaction,
  ): Promise<UserEntity> {
    const client = tx ?? this.prisma;

    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    this.logger.log(`Creating user with email=${user.email.value}`);

    const raw = await client.user.create({
      data: {
        id: user.id.value,
        email: user.email.value,
      },
    });

    return UserMapper.toDomain(raw);
  }
}
