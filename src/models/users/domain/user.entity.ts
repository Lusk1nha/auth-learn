import { ApiProperty } from '@nestjs/swagger';

import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { InvalidEmailAddressException } from 'src/common/entities/email-address/email-address.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export interface UserPatch {
  email?: EmailAddress;
  name?: string;
  image?: string;
}
export class UserEntity {
  constructor(
    id: UUID,
    email: EmailAddress,
    name?: string,
    image?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException('Invalid user ID format.');
    }

    if (!(email instanceof EmailAddress)) {
      throw new InvalidEmailAddressException();
    }

    this.id = id;
    this.email = email;
    this.name = name;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier of the user',
    type: UUID,
    required: true,
  })
  public readonly id: UUID;

  @ApiProperty({
    description: 'Email address of the user',
    type: EmailAddress,
    required: true,
  })
  public readonly email: EmailAddress;

  @ApiProperty({
    description: 'Name of the user',
    type: String,
    required: false,
    example: 'John Doe',
  })
  public readonly name?: string;

  @ApiProperty({
    description: 'Profile image URL of the user',
    type: String,
    required: false,
    example: 'https://example.com/image.jpg',
  })
  public readonly image?: string;

  @ApiProperty({
    description: 'Creation date of the user entity',
    type: Date,
    required: false,
    example: '2023-10-01T12:00:00Z',
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Last update date of the user entity',
    type: Date,
    required: false,
    example: '2023-10-01T12:00:00Z',
  })
  public readonly updatedAt?: Date;

  static create(
    id: UUID,
    email: EmailAddress,
    name?: string,
    image?: string,
  ): UserEntity {
    return new UserEntity(id, email, name, image);
  }

  public static patch(original: UserEntity, patch: UserPatch): UserEntity {
    return new UserEntity(
      original.id,
      patch.email ?? original.email,
      patch.name ?? original.name,
      patch.image ?? original.image,
      original.createdAt,
      new Date(),
    );
  }
}
