import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class InvalidPasswordException extends BaseHttpException {
  constructor() {
    super(
      {
        message:
          'Invalid password format. Password must be a non-empty string.',
        code: 'EMPTY_PASSWORD',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'EMPTY_PASSWORD',
    );
  }
}

export class WeakPasswordException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Password is too weak. It must be at least 6 characters long.',
        code: 'WEAK_PASSWORD',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'WEAK_PASSWORD',
    );
  }
}
