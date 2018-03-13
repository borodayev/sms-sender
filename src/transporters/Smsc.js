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
  async _send(uri: string, params: Object): Promise<Object> {
    const { login, password } = this.credentials || {};
    const extendedParams = {
      login,
      psw: password,
      ...params,
      fmt: 3, // return response in JSON format
    };
    const paramsUrl = new URLSearchParams(extendedParams);
    const url = `${uri}?${paramsUrl.toString()}`;
    const res = await fetch(url);
    return res.json();
  }

  // eslint-disable-next-line class-methods-use-this
  _prepareStatus(status: number): SmsStatusT {
    if (status === 1 || status === 2) {
      return 'ok';
    } else if (status === -1 || status === 0) {
      return 'pending';
    }
    return 'error';
  }
  // send message
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const uri = `http://smsc.ru/sys/send.php`;
    const extendedParams = {
      phones: phone,
      mes: message,
      ...this.commonSmsParams,
    };
    const rawResponse = await this._send(uri, extendedParams);
    const res = {
      messageId: `${rawResponse.id}-${phone}`,
      rawResponse,
    };
    return res;
  }

  // get cost of message without sending
  async getCost(phone: string, message: string): Promise<GetCostResponseT> {
    const uri = `http://smsc.ru/sys/send.php`;
    const extendedParams = {
      cost: 1,
      phones: phone,
      mes: message,
      ...this.commonSmsParams,
    };
    const rawResponse = await this._send(uri, extendedParams);
    const res = {
      cost: rawResponse.cost,
      rawResponse,
    };
    return res;
  }

  // get status of message (messageId format: id-phoneNumber)
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    const extendedParams = {
      id: messageId.split('-')[0],
      phone: messageId.split('-')[1],
      all: 2,
      ...this.commonSmsParams,
    };

    const uri = `http://smsc.ru/sys/status.php`;
    const rawResponse = await this._send(uri, extendedParams);
    const res = {
      status: this._prepareStatus(rawResponse.status),
      rawResponse,
    };
    return res;
  }

  // get current balance
  async getBalance(): Promise<GetBalanceResponseT> {
    const uri = `http://smsc.ru/sys/balance.php`;
    const params = {
      cur: 1,
      ...this.commonSmsParams,
    };
    const rawResponse = await this._send(uri, params);
    const res = {
      balance: rawResponse.balance,
      rawResponse,
    };
    return res;
  }
}
