// @flow

import 'isomorphic-fetch';
import { URLSearchParams } from 'url';

import {
  type CredentialsT,
  type SendSmsParamsT,
  type SendSmsResponseT,
  type GetCostParamsT,
  type GetCostResponseT,
} from '../definitions';

export default class Smsc {
  credentials: CredentialsT;

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  async _send(uri: string, params: Object): Promise<Object> {
    const { login, password } = this.credentials || {};
    const authParams = params || {};
    authParams.login = login;
    authParams.psw = password;

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
    const costParams = params;
    costParams.cost = 1;
    const rawData = await this._send(uri, params);
    const res = {
      cost: rawData.cost,
      response: rawData,
    };
    return res;
  }
  //
  // async getStatus(messageId: number): Promise<GetStatusOutputT> {
  //   const { password, login } = this.credentials || {};
  //
  //   // TODO 30-77718637484 split messageId and phone number
  //
  //   phones = preparePhones(phones);
  //   try {
  //     const res = await fetch(
  //       `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phones}&id=${messageId}&fmt=3`
  //     );
  //
  //     const resJSON = await res.json();
  //     return resJSON;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
  //
  // async getBalance(): Promise<number> {
  //   const { password, login } = this.credentials || {};
  //   try {
  //     const res = await fetch(
  //       `http://smsc.ru/sys/balance.php?login=${login}&psw=${password}&fmt=3`
  //     );
  //     const resJSON = await res.json();
  //     return resJSON;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
}
