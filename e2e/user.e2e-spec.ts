import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/infrastructure/module/app.module';
import * as config from 'config';
import { SMS_TOO_OFTEN } from '../src/infrastructure/presenter/rest-api/errors/errors';
import { GenderEnum } from '../src/infrastructure/shared/enum/gender.enum';

const randomPhoneGeneration = () => {
  const min = 100000000000;
  const max = 999999999999;
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand).toString();
};

const randomStringGenerator = () => {
  return Math.random()
    .toString(36)
    .substring(2, 16);
};

async function getToken(server) {
  const randomPhone = randomPhoneGeneration();
  await request(server)
    .post('/users/sms')
    .send({
      phone: randomPhone,
    });
  const res: request.Response = await request(server)
    .post('/users/signin')
    .send({
      phone: randomPhone,
      code: config.get('sms.notRandom'),
    });
  return 'Bearer ' + res.body.data.token;
}

describe('Users', () => {
  let app: INestApplication;
  let server;
  let randomPhone;
  let token;

  beforeAll(async () => {
    const app = (
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile()
    ).createNestApplication();
    await app.init();
    server = app.getHttpServer();
    randomPhone = randomPhoneGeneration();
  });

  it('POST users/sms', async () => {
    const res: request.Response = await request(server)
      .post('/users/sms')
      .send({
        phone: randomPhone,
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(Object.keys(res.body.data)).toContain('newUser');
  });

  it('POST users/signin', async () => {
    const res: request.Response = await request(server)
      .post('/users/signin')
      .send({
        phone: randomPhone,
        code: config.get('sms.notRandom'),
      });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(Object.keys(res.body.data)).toContain('token');
    token = 'Bearer ' + res.body.data.token;
  });

  it('GET users/me', async () => {
    const res: request.Response = await request(server)
      .get('/users/me')
      .set('Authorization', token);
    expect(res.status).toBe(HttpStatus.OK);
    expect(Object.keys(res.body.data)).toContain('phone');
    expect(res.body.data.phone).toBe(randomPhone);
  });

  it('PUT users/me', async () => {
    const randomFirstName = randomStringGenerator();
    const randomLastName = randomStringGenerator();

    const res: request.Response = await request(server)
      .put('/users/me')
      .set('Authorization', token)
      .send({
        firstName: randomFirstName,
        lastName: randomLastName,
      });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.data.firstName).toBe(randomFirstName);
    expect(res.body.data.lastName).toBe(randomLastName);
  });

  it('PUT users/me incorrect email', async () => {
    const token = await getToken(server);
    const email = randomStringGenerator();

    const res: request.Response = await request(server)
      .put('/users/me')
      .set('Authorization', token)
      .send({
        email,
      });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('PUT users/me incorrect birthday', async () => {
    const token = await getToken(server);
    const birthday = randomStringGenerator();

    const res: request.Response = await request(server)
      .put('/users/me')
      .set('Authorization', token)
      .send({
        birthday,
      });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('PUT users/me incorrect gender', async () => {
    const token = await getToken(server);
    const gender = randomStringGenerator();

    const res: request.Response = await request(server)
      .put('/users/me')
      .set('Authorization', token)
      .send({
        gender,
      });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('PUT users/me 3', async () => {
    const token = await getToken(server);
    const email = randomStringGenerator() + '@test.com';
    const gender = GenderEnum.MALE;
    const birthday = '2000-12-25T00:00:00.000Z';

    const res: request.Response = await request(server)
      .put('/users/me')
      .set('Authorization', token)
      .send({
        gender,
        birthday,
        email,
      });
    console.log(JSON.stringify(res.body));
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.data.email).toBe(email);
    expect(res.body.data.birthday).toBe(birthday);
    expect(res.body.data.email).toBe(email);
  });

  it('CHECK ERROR HANDLER - 401', async () => {
    const res: request.Response = await request(server).get('/users/me');
    expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(res.body.error).toBe('Unauthorized');
    expect(res.body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('CHECK ERROR HANDLER - 400', async () => {
    const res: request.Response = await request(server).post('/users/sms');
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(Object.keys(res.body)).toContain('message');
  });

  it('CHECK ERROR HANDLER - 404', async () => {
    const res: request.Response = await request(server).post('/user/sms');
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(res.body.error).toBe('Not Found');
    expect(res.body.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('CHECK ERROR HANDLER - 1003', async () => {
    await request(server)
      .post('/users/sms')
      .send({
        phone: randomPhone,
      });
    const res: request.Response = await request(server)
      .post('/users/sms')
      .send({
        phone: randomPhone,
      });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.error).toBe(SMS_TOO_OFTEN.getMessage());
    expect(res.body.statusCode).toBe(SMS_TOO_OFTEN.getCode());
  });

  /* TODO: simulate internal error
  it('CHECK ERROR HANDLER - 500', async () => {
    expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
  */

  afterAll(async () => {
    await app.close();
  });
});
