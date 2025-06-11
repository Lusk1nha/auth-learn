import { PrismaService } from 'src/common/database/database.service';
import { CredentialsService } from './credentials.service';
import { Test, TestingModule } from '@nestjs/testing';

describe(CredentialsService.name, () => {
  let service: CredentialsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        {
          provide: PrismaService,
          useValue: {
            credentials: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('Find Credentials by User ID', () => {
    it(`should be defined ${CredentialsService.prototype.findByUserId.name}`, () => {
      expect(service.findByUserId).toBeDefined();
    });
  });

  describe('Create Credentials', () => {
    it(`should be defined ${CredentialsService.prototype.createCredential.name}`, () => {
      expect(service.createCredential).toBeDefined();
    });
  });
});
