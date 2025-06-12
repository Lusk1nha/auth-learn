import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Password } from 'src/common/entities/password/password.entity';

@Injectable()
export class PasswordService {
  private readonly saltOrRounds: number = 10;

  constructor(private readonly configService: ConfigService) {
    this.saltOrRounds = +this.configService.get<number>(
      'SECURITY_SALT_ROUNDS',
      10,
    );
  }

  async hashPassword(password: Password): Promise<string> {
    const hash = await bcrypt.hash(password.value, this.saltOrRounds);
    return hash;
  }

  async comparePassword(password: Password, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password.value, hash);
    return isMatch;
  }
}
