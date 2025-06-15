import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';

describe(SessionsService.name, () => {
  let service: SessionsService;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: HashService,
          useValue: {
            generateHmacHash: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashService).toBeDefined();
  });
});
