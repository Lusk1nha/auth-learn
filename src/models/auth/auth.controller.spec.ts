import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/domain/user.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { faker } from '@faker-js/faker/.';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { RegisterUserDto } from './dto/register-user.dto';

describe(AuthController.name, () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('register route', () => {
    it(`should be defined ${AuthController.prototype.register.name}`, () => {
      expect(controller.register).toBeDefined();
    });

    it(`should call ${AuthService.prototype.register.name} when route is called with correct data`, async () => {
      const mockUserEntity = UserEntity.createNew(
        UUIDFactory.create(),
        EmailAddressFactory.from(faker.internet.email()),
      );

      const mockResponseDto: RegisterUserResponseDto =
        new RegisterUserResponseDto(mockUserEntity);

      const mockRequestDto: RegisterUserDto = {
        email: mockUserEntity.email.value,
        password: faker.internet.password(),
      };

      jest
        .spyOn(authService, 'register')
        .mockImplementationOnce(async () => mockUserEntity);

      const result = await controller.register(mockRequestDto);

      expect(result).toEqual(mockResponseDto);
      expect(authService.register).toHaveBeenCalledWith(mockRequestDto);
    });
  });

  describe('login route', () => {
    it(`should be defined ${AuthController.prototype.login.name}`, () => {
      expect(controller.login).toBeDefined();
    });
  });
});
