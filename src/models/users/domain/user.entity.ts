import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

export class UserEntity {
  constructor(
    public readonly id: UUID,
    public readonly email: EmailAddress,
    public readonly name?: string,
    public readonly image?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static createNew(
    id: UUID,
    email: EmailAddress,
    name?: string,
    image?: string,
  ): UserEntity {
    return new UserEntity(id, email, name, image);
  }
}
