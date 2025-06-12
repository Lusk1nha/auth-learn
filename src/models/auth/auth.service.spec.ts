import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PrismaService } from 'src/common/database/database.service';

describe(AuthService.name, () => {
  let service: AuthService;
  let usersService: UsersService;
  let credentialsService: CredentialsService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
            credential: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CredentialsService,
          useValue: {
            findByUserId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(credentialsService).toBeDefined();
    expect(passwordService).toBeDefined();
  });

  describe('Register User', () => {
    it(`should be defined ${AuthService.prototype.register.name}`, () => {
      expect(service.register).toBeDefined();
    });
  });
});
