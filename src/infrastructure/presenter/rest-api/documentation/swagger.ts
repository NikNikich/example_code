import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';
import * as ERRORS from '../errors/errors';
import HTTP_CODE_DESCRIPTION from './http.description';

export function configureSwagger(app: INestApplication): void {
  const scheme: 'http' | 'https' = config.get('swagger.scheme');
  if (config.get('swagger.enable')) {
    const errors = Object.keys(ERRORS).reduce(
      (allText, currentError) =>
        allText +
        `#${ERRORS[currentError].getCode()}. ${ERRORS[
          currentError
        ].getMessage()} \n`,
      '',
    );
    const options = new DocumentBuilder()
      .setTitle('BaseProject')
      .addBearerAuth()
      .addTag('bases', 'Базовая сущность')
      .addTag('users', 'Пользователи')
      .addTag('root', 'Системная информация о сервере')
      .setDescription(
        'Server started at: ' +
          new Date().toISOString() +
          ' (UTC) \n' +
          HTTP_CODE_DESCRIPTION +
          ' \n  \n' +
          errors +
          '',
      )
      .setVersion(process.env.REST_IMAGE_NAME || 'PLEASE SET ENV TAG')
      .setSchemes(scheme)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(config.get('swagger.path'), app, document, {
      swaggerOptions: {
        displayRequestDuration: 'true',
      },
    });
  }
}
