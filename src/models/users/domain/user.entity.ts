import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { InvalidEmailAddressException } from 'src/common/entities/email-address/email-address.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export class UserEntity {
  constructor(
    public readonly id: UUID,
    public readonly email: EmailAddress,
    public readonly name?: string,
    public readonly image?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException();
    }

    if (!(email instanceof EmailAddress)) {
      throw new InvalidEmailAddressException();
    }
  }

  static createNew(
    id: UUID,
    email: EmailAddress,
    name?: string,
    image?: string,
  ): UserEntity {
    return new UserEntity(id, email, name, image);
  }
}
