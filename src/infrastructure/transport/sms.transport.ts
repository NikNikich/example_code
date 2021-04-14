import * as aws from 'aws-sdk';
import { PublishInput, PublishResponse } from 'aws-sdk/clients/sns';
import * as config from 'config';
import { Notifications } from './notifications.transport';
import { MAX_PHONE_NUMBER_LENGTH } from '../presenter/rest-api/documentation/user/sign.in.by.sms.dto';

export class SmsTransport {
  public constructor() {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY || config.get('aws.accessKeyId'),
      region: process.env.AWS_REGION || config.get('aws.region'),
      secretAccessKey:
        process.env.AWS_SECRET_KEY || config.get('aws.secretAccessKey'),
    });
  }

  public async send(
    receiver: string,
    payload: string,
    requestId: string,
    userId: number,
  ): Promise<void> {
    const sns: any = new aws.SNS({
      apiVersion: '2010-03-31',
      correctClockSkew: true,
    });

    const smsParams: PublishInput = {
      Message: payload,
      MessageStructure: 'string',
      PhoneNumber: SmsTransport.setCorrectPhoneNumber(receiver),
    };

    if (config.get('sms.sendRealSms')) {
      sns
        .publish(smsParams)
        .promise()
        .then(SmsTransport.success)
        .catch(SmsTransport.error);
    }

    await Notifications.send(
      '📱 Sms request: AMAZON +' +
        receiver +
        ' UserId: ' +
        userId +
        ' Payload: ' +
        payload,
      false,
      requestId,
    );
  }

  public static setCorrectPhoneNumber(receiver: string): string {
    let result = receiver;
    // TODO: handle phone number correctly
    if (result.length > MAX_PHONE_NUMBER_LENGTH) {
      throw new Error(
        `Invalid phone number length. Number can have a maximum of 15 digits: ${receiver}`,
      );
    }
    // For Amazon SNS you have to specify the phone number using the E.164 format
    if (result[0] !== '+') {
      result = `+${result}`;
    }
    return result;
  }

  /*tslint:disable*/
  public static success(data: PublishResponse): void {
    console.log(`Message success send with id ${data.MessageId}`);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static error(error: any): void {
    console.error(`Error sending message ${error}`);
  }
}
