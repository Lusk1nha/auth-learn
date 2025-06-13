import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class LoginCredentialsInvalidException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Invalid login credentials provided.',
        code: 'LOGIN_CREDENTIALS_INVALID',
        status: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
      'LOGIN_CREDENTIALS_INVALID',
    );
  }
}
