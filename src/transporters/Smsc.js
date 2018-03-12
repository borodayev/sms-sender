// @flow

import 'isomorphic-fetch';
import { URLSearchParams } from 'url';

import {
  type CredentialsT,
  type SendSmsParamsT,
  type SendSmsResponseT,
  type GetCostParamsT,
  type GetCostResponseT,
  type GetStatusResponseT,
  type GetBalanceParamsT,
} from '../definitions';

export default class Smsc {
  credentials: CredentialsT;

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  async _send(uri: string, params: Object): Promise<Object> {
    const { login, password } = this.credentials || {};
    const authParams = {
      login,
      psw: password,
      ...params,
    };
    const paramsUrl = new URLSearchParams(authParams);
    const url = `${uri}?${paramsUrl.toString()}`;
    const res = await fetch(url);
    return res.json();
  }

  async sendSms(params: SendSmsParamsT): Promise<SendSmsResponseT> {
    const uri = `http://smsc.ru/sys/send.php`;
    const rawData = await this._send(uri, params);
    const res = {
      messageId: `${rawData.id}-${params.phones}`,
      response: rawData,
    };
    return res;
  }

  async getCost(params: GetCostParamsT): Promise<GetCostResponseT> {
    const uri = `http://smsc.ru/sys/send.php`;
    const costParams = {
      cost: 1,
      ...params,
    };
    const rawData = await this._send(uri, costParams);
    const res = {
      cost: rawData.cost,
      response: rawData,
    };
    return res;
  }

  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    const params = {
      id: messageId.split('-')[0],
      phone: messageId.split('-')[1],
      fmt: 3,
    };

    const uri = `http://smsc.ru/sys/status.php`;
    const rawData = await this._send(uri, params);
    const res = {
      status: rawData.status,
      response: rawData,
    };
    return res;

    // const states = {
    //   '-3': 'Message not found',
    //   '-1': 'Pending',
    //   '0': 'Given to operator',
    //   '1': 'Delivered',
    //   '2': 'Read',
    //   '3': 'Expired',
    //   '20': 'Can not deliver',
    //   '22': 'Wrong number',
    //   '23': 'Prohibited',
    //   '24': 'Insufficient funds',
    //   '25': 'Inaccessible number',
    // };
    // Object.entries(states).forEach(entry => {
    //   if (entry[0] === rawData.status.toString()) {
    //     status = entry[1];
    //   }
    // });
  }

  async getBalance(params: GetBalanceParamsT): Promise<{ balance: number }> {
    const uri = `http://smsc.ru/sys/balance.php`;
    const rawData = await this._send(uri, params);
    return rawData;
  }
}
