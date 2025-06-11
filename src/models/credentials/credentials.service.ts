import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: UUID) {
    const credential = await this.prisma.credential.findUnique({
      where: { userId: userId.value },
    });

    if (!credential) {
      this.logger.warn(`No credential found for user ID: ${userId.value}`);
      return null;
    }

    this.logger.log(`Found credential for user ID: ${userId.value}`);
    return credential;
  }

  async createCredential(userId: UUID, passwordHash: string) {
    const id = UUIDFactory.create();

    this.logger.log(`Creating credential for user ID: ${userId.value}`);

    const credential = await this.prisma.credential.create({
      data: {
        id: id.value,
        user: {
          connect: { id: userId.value },
        },
        passwordHash,
      },
    });

    this.logger.log(
      `Credential created with ID: ${id.value} for user ID: ${userId.value}`,
    );

    return credential;
  }
}
