import { UUID } from 'src/common/entities/uuid/uuid.entity';

export class CredentialEntity {
  constructor(
    public readonly id: UUID,
    public readonly userId: UUID,
    public readonly passwordHash: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static createNew(
    id: UUID,
    userId: UUID,
    passwordHash: string,
  ): CredentialEntity {
    return new CredentialEntity(id, userId, passwordHash);
  }
}
