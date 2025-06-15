import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';

import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';

describe(SessionsService.name, () => {
  let service: SessionsService;
  let hashService: HashService;
  let tokenService: TokenService;
  let cacheService: SessionsCacheService;

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
        {
          provide: SessionsCacheService,
          useValue: {
            getSessionFromCache: jest.fn(),
            saveSessionInCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
    cacheService = module.get<SessionsCacheService>(SessionsCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashService).toBeDefined();
  });
});
