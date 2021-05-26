import { NestFactory } from '@nestjs/core';
import { AppModule } from '../module/app.module';
import * as config from 'config';
import { configureSwagger } from '../presenter/rest-api/documentation/swagger';
import { AllExceptionsFilter } from '../presenter/rest-api/errors/all.exception.filter';
import { generateInstanceId } from '../shared/instance';
import { Notifications } from '../transport/notifications.transport';
import { INestApplication, Logger } from '@nestjs/common';
import { uptime } from '../shared/uptime';
import { WebsocketTransport } from '../transport/websocket.transport';

process.env.INSTANCE = generateInstanceId();

export async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    // logger: new MyLogger(),
  });
  const logger = new Logger('Bootstrap');

  configureSwagger(app);

  const port: number = Number(process.env.PORT) || config.get('server.port');
  app.enableCors({
    allowedHeaders: [
      'Cache-Control',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'x-api-token',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Authorization',
      'Authorized',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    maxAge: 60 * 60 * 24 * 365,
    preflightContinue: false,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  await Notifications.send('⚡️✅ Start for ' + uptime(), false);

  app.useWebSocketAdapter(new WebsocketTransport(app, true));
  await Notifications.send('⚡️✅ Websocket start for ' + uptime(), false);

  logger.log(
    `Swagger: ${config.get('server.url')}:${config.get(
      'server.port',
    )}/${config.get('swagger.path')}`,
  );

  process.on('SIGTERM', async function onSigterm() {
    const message = '⚡️️❗️ SIGTERM';
    await Notifications.send(message, true);
  });

  process.on('SIGINT', async function onSigint() {
    const message = '⚡️️⭕️️ SIGINT';
    await Notifications.send(message, true);
  });

  process.on('uncaughtException', async err => {
    const message: string = '⚡️️🆘 uncaughtException ' + err;
    logger.error(message);
    logger.error(err.stack);
    await Notifications.send(message, true);
    process.exit(1);
  });

  process.on('unhandledRejection', async (err: any) => {
    const message: string = '⚡️️⛔️ unhandledRejection ' + err;
    logger.error(message);
    logger.error(err.stack || err);
    await Notifications.send(message, true);
    process.exit(1);
  });
}
