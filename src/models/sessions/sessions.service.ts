import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../users/domain/user.entity';

import { TokenService } from '../token/token.service';

import { SessionTokens } from '../auth/__types__/auth.types';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import { InvalidSessionException } from './sessions.errors';
import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';
import { TokenEntity } from '../token/domain/token.entity';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: SessionsCacheService,
  ) {}

  async createSession(user: UserEntity): Promise<SessionTokens> {
    const tokens = await this.generateTokens(user);
    await this.cacheService.saveSessionInCache(user, tokens.refreshToken);

    return tokens;
  }

  async revalidateSessionByRefreshToken(
    user: UserEntity,
    previousToken: string,
  ): Promise<SessionTokens> {
    await this.validateTokenOwnership(user, previousToken);
    const tokens = await this.generateTokens(user);

    await this.cacheService.saveSessionInCache(user, tokens.refreshToken);
    await this.cacheService.deletePreviousSessionFromCache(previousToken);

    return tokens;
  }

  async validateRefreshToken(refreshToken: string): Promise<UserJwtPayload> {
    const payload = await this.tokenService.decodeToken(
      refreshToken,
      'refresh',
    );

    if (!payload) {
      throw new InvalidSessionException();
    }

    return payload;
  }

  private async validateTokenOwnership(user: UserEntity, token: string) {
    const cachedSession = await this.cacheService.getSessionFromCache(token);

    if (!cachedSession || cachedSession !== user.id.value) {
      this.logger.error(
        `Token ownership validation failed for user ${user.id.value}`,
      );
      throw new InvalidSessionException();
    }
  }

  private async generateTokens(user: UserEntity) {
    const accessToken = await this.tokenService.generateToken(user, 'access');
    const refreshToken = await this.tokenService.generateToken(user, 'refresh');

    return {
      accessToken,
      refreshToken,
    };
  }
}
