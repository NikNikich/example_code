import * as rp from 'request-promise-native';
import { Logger } from '@nestjs/common';
import * as config from 'config';

const token = config.get('notifications.token');
const chatId = config.get('notifications.chatId');

export class Notifications {
  public static async send(
    message: string,
    isImportant = false,
    requestId = null,
  ): Promise<void> {
    const logger = new Logger(requestId || 'Notification');

    let messageWithRequest: string = requestId
      ? `${message} [${requestId}]`
      : message;

    messageWithRequest += ` ${process.env.REST_IMAGE_NAME || ''} <${
      process.env.NODE_ENV
    }> {${process.env.INSTANCE}}`;

    const options = {
      method: 'POST',
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      qs: { chat_id: chatId, text: messageWithRequest },
    };

    if (isImportant && config.get('notifications.sendImportant')) {
      await this.sendImportantMessage(options, logger, messageWithRequest);
    } else if (config.get('notifications.sendCommon')) {
      this.sendMessage(options, logger, messageWithRequest);
    }
  }

  private static async sendImportantMessage(options, logger, message) {
    try {
      logger.log('Notification!: ' + message);
      await rp(options);
    } catch (err) {
      logger.error('Notification!: Sending error. Message: ' + message);
    }
  }

  private static sendMessage(options, logger, message) {
    (async () => {
      try {
        logger.log('Notification: ' + message);
        await rp(options);
      } catch (err) {
        logger.error('Notification: Sending error. Message: ' + message);
      }
    })();
  }
}
