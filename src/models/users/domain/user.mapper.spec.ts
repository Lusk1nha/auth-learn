import { faker } from '@faker-js/faker/.';
import { RawUser, UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';

describe(UserMapper.name, () => {
  it('should be defined', () => {
    expect(UserMapper).toBeDefined();
  });

  describe('toDomain method', () => {
    it(`should be defined ${UserMapper.toDomain.name}`, () => {
      expect(UserMapper.toDomain).toBeDefined();
    });

    it('should map raw user data to UserEntity', () => {
      const rawUser: RawUser = {
        email: faker.internet.email(),
        id: faker.string.uuid(),
        name: faker.person.firstName(),
        image: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      const userEntity = UserMapper.toDomain(rawUser);

      expect(userEntity).toBeInstanceOf(UserEntity);
      expect(userEntity.id.value).toEqual(rawUser.id);
      expect(userEntity.email.value).toEqual(rawUser.email);
      expect(userEntity.name).toEqual(rawUser.name);
      expect(userEntity.image).toEqual(rawUser.image);
      expect(userEntity.createdAt).toEqual(rawUser.createdAt);
      expect(userEntity.updatedAt).toEqual(rawUser.updatedAt);
    });
  });

  describe('toModel method', () => {
    it(`should be defined ${UserMapper.toModel.name}`, () => {
      expect(UserMapper.toModel).toBeDefined();
    });

    it('should map UserEntity to raw user data', () => {
      const id = faker.string.uuid();
      const email = faker.internet.email();

      const userEntity = UserEntity.createNew(
        UUIDFactory.from(id),
        EmailAddressFactory.from(email),
        faker.person.firstName(),
        faker.image.avatar(),
      );

      const rawUser = UserMapper.toModel(userEntity);

      expect(rawUser).toEqual({
        id: userEntity.id.value,
        email: userEntity.email.value,
        name: userEntity.name,
        image: userEntity.image,
      });
    });
  });
});
