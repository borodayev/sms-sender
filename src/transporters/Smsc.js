// @flow

import 'isomorphic-fetch';
import { URLSearchParams } from 'url';

import type {
  SendSmsResponseT,
  GetCostResponseT,
  GetStatusResponseT,
  GetBalanceResponseT,
  SmsStatusT,
  TransporterI,
} from '../definitions';

type CredentialsT = {|
  login: string,
  password: string,
|};

export default class Smsc implements TransporterI {
  credentials: CredentialsT;
  commonSmsParams = {
    tinyurl: 1,
    charset: 'utf-8',
    translit: 1,
  };

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  // make request to SMSC API
  async _send(cmd: 'send' | 'status' | 'balance', params: Object): Promise<Object> {
    const { login, password } = this.credentials || {};
    const extendedParams = {
      login,
      psw: password,
      ...params,
      fmt: 3, // return response in JSON format
    };
    const paramsUrl = new URLSearchParams(extendedParams);
    const url = `http://smsc.ru/sys/${cmd}.php?${paramsUrl.toString()}`;
    const res = await fetch(url);
    return res.json();
  }

  // get more detailed description on https://smsc.kz/api/http/status_messages/statuses/#menu
  // eslint-disable-next-line class-methods-use-this
  _prepareStatus(status: number): SmsStatusT {
    switch (status) {
      case -3:
        return 'error'; // -3 - Message not found
      case -1:
        return 'pending'; // -1 - Waiting for sending
      case 0:
        return 'pending'; // 0 - Given to operator
      case 1:
        return 'ok'; // 1 - Delivered
      case 2:
        return 'ok'; // 2 - Read
      case 3:
        return 'error'; // 3 - Overdue message
      case 20:
        return 'error'; // 20 - Can not deliver
      case 22:
        return 'error'; // 22 - Wrong number
      case 23:
        return 'error'; // 23 - Prohibited
      case 24:
        return 'error'; // 24 - Insufficient funds
      case 25:
        return 'error'; // 24 - Inaccessible number
      default:
        return 'error';
    }
  }

  // send message
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const params = {
      phones: phone,
      mes: message,
      ...this.commonSmsParams,
    };
    const rawResponse = await this._send('send', params);
    const res = {
      messageId: `${rawResponse.id}-${phone}`,
      rawResponse,
    };
    return res;
  }

  // get cost of message without sending
  async getCost(phone: string, message: string): Promise<GetCostResponseT> {
    const params = {
      cost: 1,
      phones: phone,
      mes: message,
      ...this.commonSmsParams,
    };

    const rawResponse = await this._send('send', params);
    const res = {
      cost: rawResponse.cost,
      rawResponse,
    };
    return res;
  }

  // get status of message (messageId format: id-phoneNumber)
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    const params = {
      id: messageId.split('-')[0],
      phone: messageId.split('-')[1],
      all: 2,
      ...this.commonSmsParams,
    };

    const rawResponse = await this._send('status', params);
    const res = {
      status: this._prepareStatus(rawResponse.status),
      rawResponse,
    };
    return res;
  }

  // get current balance
  async getBalance(): Promise<GetBalanceResponseT> {
    const params = {
      cur: 1,
      ...this.commonSmsParams,
    };

    const rawResponse = await this._send('balance', params);
    const res = {
      balance: rawResponse.balance,
      rawResponse,
    };
    return res;
  }
}
