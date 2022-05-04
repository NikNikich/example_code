import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitLogRepository } from '../../core/domain/repository/log.repository';
import { RabbitService } from '../../application/services/rabbit.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'amq.topic',
          type: 'topic',
        },
      ],
      uri: config.get('rabbitMQ.uri'),
      connectionInitOptions: { wait: false, reject: false },
    }),
    RabbitModule,
    TypeOrmModule.forFeature([RabbitLogRepository]),
  ],
  providers: [RabbitService],
  controllers: [],
})
export class RabbitModule {}
