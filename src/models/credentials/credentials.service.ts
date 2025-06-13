import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

import { CredentialEntity } from './domain/credential.entity';
import { CredentialMapper } from './domain/credential.mapper';
import { CredentialAlreadyExistsForUserException } from './credentials.errors';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: UUID) {
    const credential = await this.prisma.credential.findUnique({
      where: { userId: userId.value },
    });

    if (!credential) {
      return null;
    }

    this.logger.log(`Found credential for user ID=${userId.value}`);
    return CredentialMapper.toDomain(credential);
  }

  async createCredential(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    const client = tx ?? this.prisma;

    const existingCredential = await this.findByUserId(credential.userId);

    if (existingCredential) {
      throw new CredentialAlreadyExistsForUserException();
    }

    this.logger.log(
      `Creating credential for user ID=${credential.userId.value}`,
    );

    const raw = await client.credential.create({
      data: {
        id: credential.id.value,
        user: {
          connect: { id: credential.userId.value },
        },
        passwordHash: credential.passwordHash,
      },
    });

    return CredentialMapper.toDomain(raw);
  }
}
