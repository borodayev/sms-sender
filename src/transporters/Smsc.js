// @flow

import 'isomorphic-fetch';
import { URLSearchParams } from 'url';

import { type CredentialsT, type SendSmsResponseT, type SendSmsParamsT } from '../definitions';

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

  async sendSms(params: $Shape<SendSmsParamsT>): Promise<SendSmsResponseT> {
    const uri = `http://smsc.ru/sys/send.php`;
    const rawData = await this._send(uri, params);
    const res = {
      messageId: `${rawData.id}-${params.phones}`,
      response: rawData,
    };
    return res;
  }

  // // cost: number
  // // response: mixed, // vanila response from transporter
  // async getCost(phone: PhonesType, message: string): Promise<number> {
  //   // TODO: return only cost
  //   const { password, login } = this.credentials || {};
  //   phones = preparePhones(phones);
  //   try {
  //     const res = await fetch(
  //       `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=1`
  //     );
  //     const resJSON = await res.json();
  //     return resJSON;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // }
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
