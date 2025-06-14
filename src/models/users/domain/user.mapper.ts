import { Prisma } from '@prisma/client';
import { UserEntity } from './user.entity';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';

export type RawUser = Prisma.UserGetPayload<{}>;

export class UserMapper {
  static toDomain(raw: RawUser): UserEntity {
    return new UserEntity(
      new UUID(raw.id),
      new EmailAddress(raw.email),
      raw.name ?? undefined,
      raw.image ?? undefined,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toModel(entity: UserEntity) {
    return {
      id: entity.id.value,
      email: entity.email.value,
      name: entity.name ?? null,
      image: entity.image ?? null,
    };
  }
}
