import { Cache } from 'cache-manager';
import { HashService } from '../hash/hash.service';
import { SessionsCacheService } from './sessions-cache.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe(SessionsCacheService.name, () => {
  let service: SessionsCacheService;
  let hashService: HashService;
  let cacheService: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsCacheService,
        {
          provide: HashService,
          useValue: {
            generateHmacHash: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsCacheService>(SessionsCacheService);
    hashService = module.get<HashService>(HashService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashService).toBeDefined();
    expect(cacheService).toBeDefined();
  });
});
