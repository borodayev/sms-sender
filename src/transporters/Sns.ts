// @flow

import AWS from 'aws-sdk';

import type {
  SendSmsResponseT,
  GetCostResponseT,
  GetStatusResponseT,
  GetBalanceResponseT,
  ProviderI,
} from '../definitions';

type SnsParamsT = {
  accessKeyId?: string,
  secretAccessKey?: string,
  region: string,
};

export default class Sns implements ProviderI {
  sns: Object;

  constructor(params: SnsParamsT) {
    const { accessKeyId, secretAccessKey, region } = params || {};

    // if credentials were put manually
    if (accessKeyId && secretAccessKey) {
      this.sns = new AWS.SNS({ accessKeyId, secretAccessKey, region });
    } else {
      // if credentials were put in ~/.aws/credentials
      this.sns = new AWS.SNS({ region });
    }
  }

  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const params = {
      Message: message,
      MessageStructure: 'String',
      PhoneNumber: phone,
    };

    const rawResponse = await new Promise((resolve, reject) => {
      this.sns.publish(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

    const res = {
      messageId: rawResponse.MessageId,
      rawResponse,
    };

    return res;
  }

  // get current provider name
  // eslint-disable-next-line class-methods-use-this
  getProviderName(): string {
    return 'sns';
  }

  // eslint-disable-next-line
  async getCost(phone: string, message: string): Promise<GetCostResponseT> {
    throw new Error(`AWS.SNS does not support getting cost via 'aws-sdk'`);
  }

  // eslint-disable-next-line
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    throw new Error(`AWS.SNS does not support getting status via 'aws-sdk'`);
  }

  // eslint-disable-next-line
  async getBalance(): Promise<GetBalanceResponseT> {
    throw new Error(`AWS.SNS does not support getting balance via 'aws-sdk'`);
  }
}
