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

  // AWS.SDK DOES NOT PROVIDE THE WAYS TO IMPLEMENTS THESE METHODS

  // eslint-disable-next-line
   async getCost(phone: string, message: string): Promise<GetCostResponseT> {
    return new Promise(resolve => {
      resolve({ cost: '0', rawResponse: { cnt: 1, cost: '0' } });
    });
  }

  // eslint-disable-next-line
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    return new Promise(resolve => {
      resolve({
        rawResponse: {
          cost: '0.00',
          country: 'Казахстан',
          last_date: '13.03.2018 15:50:50',
          last_timestamp: 1520934650,
          message: 'hello',
          operator: 'Beeline',
          phone: '77718637484',
          region: '',
          send_date: '13.03.2018 15:50:46',
          send_timestamp: 1520934646,
          sender_id: 'SMS-CENTRE',
          status: 1,
          status_name: 'Доставлено',
          type: 0,
        },
        status: 'ok',
      });
    });
  }

  // eslint-disable-next-line
  async getBalance(): Promise<GetBalanceResponseT> {
    return new Promise(resolve => {
      resolve({ balance: '84.75', rawResponse: { balance: '84.75', currency: 'KZT' } });
    });
  }
}
