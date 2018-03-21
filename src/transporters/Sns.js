// @flow

import AWS from 'aws-sdk';

import type {
  SendSmsResponseT,
  // GetCostResponseT,
  // GetStatusResponseT,
  // GetBalanceResponseT,
  // SmsStatusT,
  // ProviderI,
} from '../definitions';

type SnsParamsT = {
  accessKeyId?: string,
  secretAccessKey?: string,
  region: string,
};

export default class Sns /* implements ProviderI */ {
  sns: Object;

  constructor(params: SnsParamsT) {
    const { accessKeyId, secretAccessKey, region } = params || {};

    // if credentials were put manually
    if (accessKeyId && secretAccessKey) {
      AWS.config = { accessKeyId, secretAccessKey, region };
      this.sns = new AWS.SNS();
    } else {
      // if credentials were put in ~/.aws/credentials
      AWS.config = { region };
      this.sns = new AWS.SNS();
    }
  }

  // TODO: need to take messageid, and request object for checking status of message
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const params = {
      Message: message,
      MessageStructure: 'String',
      PhoneNumber: phone,
    };
    const request = await this.sns.publish(params);
    await request.send();
    return request;
  }
  // async getCost(phone: string, message: string): Promise<GetCostResponseT> {}
  // async getStatus(messageId: string): Promise<GetStatusResponseT> {}
  // async getBalance(): Promise<GetBalanceResponseT> {}
  // getProviderName(): string {}
}
