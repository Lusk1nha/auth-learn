import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe(AppController.name, () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getIndex: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(appService).toBeDefined();
  });

  describe('getIndex route', () => {
    it(`should be defined ${AppController.prototype.getIndex.name}`, () => {
      expect(controller.getIndex).toBeDefined();
    });
  });
});
