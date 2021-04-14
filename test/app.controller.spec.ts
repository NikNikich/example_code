import { AppController } from '../src/infrastructure/presenter/rest-api/controller/app.controller';
import { TestingModule, Test } from '@nestjs/testing';
import { AppService } from '../src/application/services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return root info', () => {
      const result = appController.getRoot('randomId');
      expect(Object.keys(result)).toStrictEqual([
        'success',
        'timestamp',
        'requestId',
        'statusCode',
        'data',
      ]);
    });
  });
});
