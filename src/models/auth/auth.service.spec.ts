import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PrismaService } from 'src/common/database/database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from '../users/domain/user.entity';
import { CredentialEntity } from '../credentials/domain/credential.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { faker } from '@faker-js/faker/.';
import { SessionsService } from '../sessions/sessions.service';

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: UsersService;
  let credentialsService: CredentialsService;
  let passwordService: PasswordService;
  let sessionsService: SessionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (cb) => cb({})),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: CredentialsService,
          useValue: {
            findByUserId: jest.fn(),
            createCredential: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
        {
          provide: SessionsService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    passwordService = module.get<PasswordService>(PasswordService);
    sessionsService = module.get<SessionsService>(SessionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(credentialsService).toBeDefined();
    expect(passwordService).toBeDefined();
  });

  describe('Register User', () => {
    it(`should be defined ${AuthService.prototype.register.name}`, () => {
      expect(authService.register).toBeDefined();
    });

    it('should register a user and create credential inside transaction', async () => {
      const dto: RegisterUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUserId = UUIDFactory.create();
      const mockCredId = UUIDFactory.create();

      const mockUserEntity = UserEntity.createNew(
        mockUserId,
        EmailAddressFactory.from(dto.email),
      );

      const mockCredentialEntity = CredentialEntity.createNew(
        mockCredId,
        mockUserId,
        'hashed-password',
      );

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce('hashed-password');

      jest
        .spyOn(usersService, 'createUser')
        .mockImplementationOnce(async () => mockUserEntity);

      jest
        .spyOn(credentialsService, 'createCredential')
        .mockImplementationOnce(async () => mockCredentialEntity);

      const result = await authService.register(dto);

      expect(passwordService.hashPassword).toHaveBeenCalled();
      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.any(UserEntity),
        expect.any(Object),
      );
      expect(credentialsService.createCredential).toHaveBeenCalledWith(
        expect.any(CredentialEntity),
        expect.any(Object),
      );
      expect(prisma.$transaction).toHaveBeenCalled();

      expect(result).toEqual(mockUserEntity);
    });
  });

  describe('Login User', () => {
    it(`should be defined ${AuthService.prototype.login.name}`, () => {
      expect(authService.login).toBeDefined();
    });
  });
});
