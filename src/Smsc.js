// @flow
/* eslint-disable no-param-reassign */

import 'isomorphic-fetch';
import { preparePhones, writeToDB } from './utils';

export type PhonesType = string | Array<string>;
// export type sendOpts = {
//   sender: string,
//   tinyurl: 0 | 1,
//   time: Date,
//   tz: number,
//   flash: 0 | 1,
// };
export type credentialsType = {
  login: string,
  password: string,
};

export default class Smsc {
  credentials: credentialsType;

  constructor(credentials: credentialsType) {
    this.credentials = credentials;
  }

  async sendSms(phones: PhonesType, message: string /* options?: sendOpts */): Promise<any> {
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    const res = await fetch(
      `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=3`
    );

    const resJSON = await res.json();
    await writeToDB(resJSON, message, phones);
    return resJSON;
  }

  async getCost(phones: PhonesType, message: string): Promise<any> {
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    const res = await fetch(
      `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=1`
    );
    const resJSON = await res.json();
    return resJSON;
  }

  async getStatus(id: number, phones: PhonesType): Promise<any> {
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    const res = await fetch(
      `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phones}&id=${id}&fmt=3`
    );

    const resJSON = await res.json();
    return resJSON;
  }

  async getBalance(): Promise<any> {
    const { password, login } = this.credentials || {};
    const res = await fetch(`http://smsc.ru/sys/balance.php?login=${login}&psw=${password}&fmt=3`);
    const resJSON = await res.json();
    return resJSON;
  }
}
