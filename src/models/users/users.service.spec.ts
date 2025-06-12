import { PrismaService } from 'src/common/database/database.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import {
  generateMockUsers,
  generateSingleMockUser,
} from './__mock__/users.mock';

jest.mock('src/common/entities/uuid/uuid.factory');

describe(UsersService.name, () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('Find user by email', () => {
    it(`should be defined ${UsersService.prototype.findUserByEmail.name}`, () => {
      expect(service.findUserByEmail).toBeDefined();
    });

    it('should return a user if found by email', async () => {
      const email = faker.internet.email();
      const mockId = faker.string.uuid();

      const userFound = generateSingleMockUser({
        id: mockId,
        email,
      });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userFound);

      const result = await service.findUserByEmail(
        EmailAddressFactory.from(email),
      );
      expect(result).toEqual(userFound);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if no user found', async () => {
      const email = faker.internet.email();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findUserByEmail(
        EmailAddressFactory.from(email),
      );
      expect(result).toBeNull();
    });
  });

  describe('Create new user', () => {
    it(`should be defined ${UsersService.prototype.createUser.name}`, () => {
      expect(service.createUser).toBeDefined();
    });

    it('should create a new user', async () => {
      const mockId = faker.string.uuid();
      const email = faker.internet.email();

      const userCreated: User = generateSingleMockUser({
        id: mockId,
        email,
        image: null,
        name: null,
      });

      (UUIDFactory.create as jest.Mock).mockReturnValue({ value: mockId });

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(userCreated);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.createUser(EmailAddressFactory.from(email));

      expect(result).toEqual(userCreated);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: mockId,
          email,
        },
      });
    });
  });
});
