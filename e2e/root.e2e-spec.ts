import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/infrastructure/module/app.module';

describe('Root', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const app = (
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile()
    ).createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  it('GET /', async () => {
    const res: request.Response = await request(server).get('/');
    expect(res.status).toBe(HttpStatus.OK);
    expect(Object.keys(res.body.data)).toContain('uptime');
    expect(Object.keys(res.body.data)).toContain('env');
    expect(res.body.data.env).toBe(process.env.NODE_ENV);
    expect(Object.keys(res.body.data)).toContain('system');
  });

  afterAll(async () => {
    await app.close();
  });
});
