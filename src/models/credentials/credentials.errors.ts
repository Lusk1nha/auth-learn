import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class CredentialAlreadyExistsForUserException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Credential already exists for this user.',
        code: 'CREDENTIAL_ALREADY_EXISTS',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
      'CREDENTIAL_ALREADY_EXISTS',
    );
  }
}
