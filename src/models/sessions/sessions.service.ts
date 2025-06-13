import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../users/domain/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(private readonly hashService: HashService) {}

  async createSession(user: UserEntity) {
    const tokens = this.generateTokens(user);
    await this.saveSession(user, tokens.refreshToken);

    return tokens;
  }

  private generateTokens(user: UserEntity) {
    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  private async saveSession(user: UserEntity, refreshToken: string) {
    const tokenHash = this.hashService.generate(refreshToken);
  }
}
