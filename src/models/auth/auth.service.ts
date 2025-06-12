import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PasswordService } from '../password/password.service';
import { RegisterUserDto } from './dto/register-user.dto';

import { UserEntity } from '../users/domain/user.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { PasswordFactory } from 'src/common/entities/password/password.factory';
import { CredentialEntity } from '../credentials/domain/credential.entity';
import { PrismaService } from 'src/common/database/database.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(dto: RegisterUserDto) {
    const userId = UUIDFactory.create();
    const emailVo = EmailAddressFactory.from(dto.email);
    const passwordVo = PasswordFactory.from(dto.password);
    const passwordHash = await this.passwordService.hashPassword(passwordVo);

    const userEntity = UserEntity.createNew(userId, emailVo);
    const credEntity = CredentialEntity.createNew(
      UUIDFactory.create(),
      userId,
      passwordHash,
    );

    const [createdUser, createdCred] = await this.prisma.$transaction(
      async (tx) =>
        Promise.all([
          this.usersService.createUser(userEntity, tx),
          this.credentialsService.createCredential(credEntity, tx),
        ]),
    );

    this.logger.log(
      `User registered with email=${dto.email} and userId=${userId.value}`,
    );

    console.log(createdUser, createdCred);
  }
}
