import { PrismaService } from 'src/common/database/database.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

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

  describe('Create new user', () => {
    it('should create a new user', async () => {
      const mockId = faker.string.uuid(); // ID simulado
      const email = faker.internet.email();
      const userCreated: User = {
        id: mockId,
        email,
        name: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

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
