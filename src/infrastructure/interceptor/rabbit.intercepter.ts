import { Message, RMQIntercepterClass } from 'nestjs-rmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitIntercepter extends RMQIntercepterClass {
  async intercept(res: any, msg: Message, error: Error): Promise<any> {
    // res - response body
    // msg - initial message we are replying to
    // error - error if exists or null
    this.logger.error(error);
    return res;
  }
}
