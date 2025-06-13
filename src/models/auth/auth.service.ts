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
import { LoginUserDto } from './dto/login-user.dto';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { Password } from 'src/common/entities/password/password.entity';
import { UserNotFoundException } from '../users/users.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { CredentialNotFoundException } from '../credentials/credentials.errors';
import { LoginCredentialsInvalidException } from './auth.errors';
import { SessionsService } from '../sessions/sessions.service';

/**
 * O AuthService é responsável por gerenciar a autenticação e o registro de usuários.
 * Segui um principio de responsabilidade única, focando apenas em autenticação e registro.
 * Ele não deve lidar com lógica de negócios relacionada a usuários ou credenciais.
 *
 * Obs: VO (Valor Object) são utilizados para encapsular regras de validação e garantir a integridade dos dados.
 * Exemplo: EmailAddressFactory, PasswordFactory.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
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

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await this.usersService.createUser(userEntity, tx);
      await this.credentialsService.createCredential(credEntity, tx);

      return user;
    });

    this.logger.log(
      `[register] User registered with email=${dto.email} and userId=${userId.value}`,
    );

    return createdUser;
  }

  async login(dto: LoginUserDto) {
    const emailVo = EmailAddressFactory.from(dto.email);
    const passwordVo = PasswordFactory.from(dto.password);

    const user = await this.ensureUserCredentials(emailVo, passwordVo); // Ensure user exists and credentials are valid

    const { accessToken, refreshToken } = await this.generateSession(user);

    this.logger.log(
      `[login] User logged in with email=${emailVo.value} and userId=${user.id.value}`,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateSession(user: UserEntity) {
    const session = await this.sessionsService.createSession(user);

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  private async findUserByEmailOrThrow(
    email: EmailAddress,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(
        `[findUserByEmailOrThrow] User not found for email=${email.value}`,
      );
      throw new UserNotFoundException();
    }

    return user;
  }

  private async findCredentialByUserIdOrThrow(
    userId: UUID,
  ): Promise<CredentialEntity> {
    const credential = await this.credentialsService.findByUserId(userId);

    if (!credential) {
      this.logger.warn(
        `[findCredentialByUserIdOrThrow] Credential not found for userId=${userId.value}`,
      );
      throw new CredentialNotFoundException();
    }

    return credential;
  }

  private async validatePassword(
    credential: CredentialEntity,
    password: Password,
  ): Promise<boolean> {
    const isValid = await this.passwordService.comparePassword(
      password,
      credential.passwordHash,
    );

    if (!isValid) {
      this.logger.warn(
        `[validatePassword] Invalid password for userId=${credential.userId.value}`,
      );

      throw new LoginCredentialsInvalidException();
    }

    return isValid;
  }

  private async ensureUserCredentials(
    email: EmailAddress,
    password: Password,
  ): Promise<UserEntity> {
    const user = await this.findUserByEmailOrThrow(email);
    const credential = await this.findCredentialByUserIdOrThrow(user.id);

    await this.validatePassword(credential, password);

    this.logger.log(
      `[ensureUserCredentials] User credentials validated for userId=${user.id.value}`,
    );

    return user;
  }
}
