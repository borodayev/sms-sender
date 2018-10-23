// @flow
import 'isomorphic-fetch';
import axios from 'axios';

import type { SendSmsResponseT, GetStatusResponseT, SmsStatusT, ProviderI } from '../definitions';

type CredentialsT = {|
  url: string,
  in: string,
  password: string,
|};

export default class PlayMobile implements ProviderI {
  credentials: CredentialsT;

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  // make request to PlayMobile API
  async _send(cmd: 'send' | 'get-status', params: Object): Promise<Object> {
    const { login, password, url } = this.credentials || {};
    const stringToEncode = `${login}:${password}`;
    try {
      const response = await axios({
        method: 'post',
        url: `${url}/${cmd}`,
        data: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(stringToEncode).toString('base64')}`,
        },
      });
      return cmd === 'get-status'
        ? { body: response.data }
        : { statusCode: response.status, body: response.data };
    } catch (e) {
      return {
        statusCode: e.response.status,
        errMsg: (e.response && e.response.statusText) || ' ',
      };
    }
  }

  // get more detailed description on https://smsc.kz/api/http/status_messages/statuses/#menu
  // eslint-disable-next-line class-methods-use-this
  _prepareStatus(status: string): SmsStatusT {
    switch (status) {
      case 'failed':
        return 'error'; //  - Not delivered
      case 'notDelivered':
        return 'pending'; //  - Waiting for sending
      case 'deferred':
        return 'pending'; //  - Given to operator
      case 'transmitted':
        return 'ok'; //  - Delivered
      case 'delivered':
        return 'ok'; //  - Delivered
      default:
        return 'error';
    }
  }

  // send message
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const mesId = Math.floor(100000 + Math.random() * 900000);
    const params = this.createParams({
      mesId,
      phone,
      message,
    });
    const rawResponse = await this._send('send', params);
    const res = {
      messageId: `${mesId}-${phone}`,
      rawResponse,
    };
    return res;
  }

  // get status of message (messageId format: id-phoneNumber)
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    const params = {
      'message-id': [messageId.trim().split('-')[0]],
    };
    const rawResponse = await this._send('get-status', params);
    const res = {
      status: this._prepareStatus(rawResponse.status),
      rawResponse,
    };
    return res;
  }

  // get current provider name
  // eslint-disable-next-line class-methods-use-this
  getProviderName(): string {
    return 'PlayMobile';
  }
  // eslint-disable-next-line class-methods-use-this
  createParams(options): Object {
    const { mesId, phone, message } = options || {};
    return {
      messages: [
        {
          'message-id': mesId,
          recipient: phone,
          sms: {
            ttl: '300',
            originator: 'smsSender',
            content: {
              text: message,
            },
          },
        },
      ],
    };
  }
}
