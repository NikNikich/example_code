import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '../presenter/rest-api/controller/app.controller';
import { AppService } from '../../application/services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseModule } from './base.module';
import { UserModule } from './user.module';
import { typeOrmConfig } from '../typeorm/typeorm.config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../presenter/rest-api/errors/all.exception.filter';
import { routerLogger } from '../presenter/rest-api/router.logger';
import { EquipmentModule } from './equipment.module';
import { BuildingModule } from './building.module';
import { WebsocketTransport } from '../transport/websocket.transport';
import { RoleRepository } from '../../core/domain/repository/role.repository';
import { MachineLearningModule } from './machine_learning.module';
import { RabbitLogRepository } from '../../core/domain/repository/log.repository';
import { RabbitService } from '../../application/services/rabbit.service';
import { ParameterEquipmentRepository } from '../../core/domain/repository/parameter.equipment.repository';
import { RMQModule } from 'nestjs-rmq';
import { RabbitMiddle } from '../middle/rabbit.middle';
import { RabbitIntercepter } from '../interceptor/rabbit.intercepter';
import { EquipmentRepository } from '../../core/domain/repository/equipment.repository';
import * as config from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      RoleRepository,
      RabbitLogRepository,
      ParameterEquipmentRepository,
      EquipmentRepository,
    ]),
    RMQModule.forRoot({
      exchangeName: config.get<string>('rabbitMQ.exchange'),
      connections: [
        {
          login: config.get<string>('rabbitMQ.login'),
          password: config.get<string>('rabbitMQ.password'),
          host: config.get<string>('rabbitMQ.host'),
        },
      ],
      queueName: config.get<string>('rabbitMQ.queue1'),
      middleware: [RabbitMiddle],
      intercepters: [RabbitIntercepter],
    }),
    UserModule,
    EquipmentModule,
    BaseModule,
    BuildingModule,
    MachineLearningModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RabbitService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    WebsocketTransport,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(routerLogger).forRoutes('*');
  }
}
