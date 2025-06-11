import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  private readonly saltOrRounds: number = 10;

  constructor(private readonly configService: ConfigService) {
    this.saltOrRounds = +this.configService.get<number>(
      'SECURITY_SALT_ROUNDS',
      10,
    );
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltOrRounds);
    return hash;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }
}
