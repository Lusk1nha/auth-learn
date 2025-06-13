import { Injectable } from '@nestjs/common';

import { createHmac } from 'crypto';
import {
  GenerateHashHmacException,
  InvalidHashSecretException,
} from './hash.errors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  private readonly secret: string;
  private readonly algorithm: string;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('HMAC_SECRET');
    const algorithm = this.configService.get<string>('HMAC_ALGORITHM');

    if (!secretKey || !algorithm) {
      throw new InvalidHashSecretException();
    }

    this.secret = secretKey;
    this.algorithm = algorithm;
  }

  generate(data: string): string {
    this.ensureSecretIsValid();

    try {
      return createHmac(this.algorithm, this.secret)
        .update(data, 'utf8')
        .digest('hex');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erro desconhecido no HMAC';
      throw new GenerateHashHmacException(message);
    }
  }

  private ensureSecretIsValid(): void {
    if (typeof this.secret !== 'string' || !this.secret.trim()) {
      throw new InvalidHashSecretException();
    }
  }
}
