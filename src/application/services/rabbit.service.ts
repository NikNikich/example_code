import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import * as config from 'config';
import { RabbitLogRepository } from '../../core/domain/repository/log.repository';
import { RabbitLog } from '../../core/domain/entity/log.entity';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitService {
  constructor(private rabbitLogRepository: RabbitLogRepository) {}

  private snEquipment = 'dfgg4353hhh';
  private regexp = new RegExp('([^.]+)', 'g');

  @RabbitRPC({
    queue: config.get('rabbitMQ.queue1'),
    exchange: config.get('rabbitMQ.exchange'),
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async pubSubQueue1(msg: {}, amqpMsg: ConsumeMessage) {
    const log = new RabbitLog();
    const routingKey = amqpMsg.fields.routingKey;
    const key = +config.get('rabbitMQ.replacement1');
    log.message = JSON.stringify(msg);
    log.snEquipment = this.getKey(routingKey, key);
    await this.rabbitLogRepository.save(log);
  }

  @RabbitRPC({
    queue: config.get('rabbitMQ.queue2'),
    exchange: config.get('rabbitMQ.exchange'),
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async pubSubQueue2(msg: {}, amqpMsg: ConsumeMessage) {
    const log = new RabbitLog();
    const routingKey = amqpMsg.fields.routingKey;
    const key = +config.get('rabbitMQ.replacement2');
    log.message = JSON.stringify(msg);
    log.snEquipment = this.getKey(routingKey, key);
    await this.rabbitLogRepository.save(log);
  }

  @RabbitRPC({
    queue: config.get('rabbitMQ.queue3'),
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async pubSubQueue3(msg: {}, amqpMsg: ConsumeMessage) {
    const log = new RabbitLog();
    const routingKey = amqpMsg.fields.routingKey;
    const key = +config.get('rabbitMQ.replacement3');
    log.message = JSON.stringify(msg);
    log.snEquipment = this.getKey(routingKey, key);
    await this.rabbitLogRepository.save(log);
  }

  private getKey(routingKey: string, key: number): string {
    const routingKeyFind = routingKey.match(this.regexp);
    const writeSnEquipment =
      routingKeyFind && routingKey[key] ? routingKey[key] : this.snEquipment;
    return writeSnEquipment;
  }
}
