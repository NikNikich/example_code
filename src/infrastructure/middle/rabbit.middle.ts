import { Message, RMQPipeClass } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMiddle extends RMQPipeClass {
  async transfrom(msg: Message): Promise<Message> {
    this.logger.error(msg);
    return msg;
  }
}
