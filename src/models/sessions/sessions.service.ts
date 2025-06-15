import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../users/domain/user.entity';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { TokenEntity } from '../token/domain/token.entity';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async createSession(user: UserEntity) {
    const tokens = await this.generateTokens(user);
    await this.saveSession(user, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: UserEntity) {
    const accessToken = await this.tokenService.generateToken(user, 'access');
    const refreshToken = await this.tokenService.generateToken(user, 'refresh');

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveSession(user: UserEntity, refreshToken: TokenEntity) {
    const token = refreshToken.token;

    const tokenHash = this.hashService.generate(token);
    this.logger.log(
      `Saving session for user ${user.id.value} with token hash ${tokenHash}`,
    );
  }
}
