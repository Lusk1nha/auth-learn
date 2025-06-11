import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/common/database/database.service';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';

import { UserAlreadyExistsException } from './users.errors';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: EmailAddress) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!user) {
      this.logger.warn(`No user found with email: ${email.value}`);
      return null;
    }

    this.logger.log(`Found user with email: ${email.value}`);
    return user;
  }

  async createUser(email: EmailAddress) {
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsException(email.value);
    }

    this.logger.log(`Creating user with email: ${email.value}`);

    const id = UUIDFactory.create();

    const user = this.prisma.user.create({
      data: {
        id: id.value,
        email: email.value,
      },
    });

    this.logger.log(
      `User created with ID: ${id.value} and email: ${email.value}`,
    );

    return user;
  }
}
