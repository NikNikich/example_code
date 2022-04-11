import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import * as config from 'config';
import { RabbitLogRepository } from '../../core/domain/repository/log.repository';
import { RabbitLog } from '../../core/domain/entity/log.entity';

@Injectable()
export class RabbitService {
  constructor(private rabbitLogRepository: RabbitLogRepository) {}

  private snEquipment = 'dfgg4353hhh';

  @RabbitSubscribe({
    queue: config.get('rabbitMQ.queue1'),
  })
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async pubSubHandler(msg: {}) {
    const log = new RabbitLog();
    log.message = JSON.stringify(msg);
    log.snEquipment = this.snEquipment;
    await this.rabbitLogRepository.save(log);
  }
}
