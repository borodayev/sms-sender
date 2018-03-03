// @flow

import 'isomorphic-fetch';
import { Sms } from './schema/Sms';

export type phonesType = string | Array<string>;
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

  async sendSms(phones: phonesType, message: string /* options?: sendOpts */): Promise<any> {
    const { password, login } = this.credentials || {};
    if (Array.isArray(phones)) {
      phones = phones.join(','); // eslint-disable-line no-param-reassign
    }
    const res = await fetch(
      `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3`
    );

    const resJSON = await res.json();
    await Smsc.writeToDB(resJSON, message, phones);

    return resJSON;
  }

  async getStatus(id: number, phone: phonesType): Promise<any> {
    const { password, login } = this.credentials || {};
    if (Array.isArray(phone)) {
      phone = phone.join(','); // eslint-disable-line no-param-reassign
    }
    const res = await fetch(
      `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phone}&id=${id}&fmt=3`
    );
    const resJSON = await res.json();

    return resJSON;
  }

  async getBalance(): Promise<any> {
    const { password, login } = this.credentials || {};
    const res = await fetch(`http://smsc.ru/sys/balance.php?login=${login}&psw=${password}fmt=3`);
    const resJSON = await res.json();

    return resJSON;
  }

  static async writeToDB(res: any, message: string, phones: phonesType): Promise<any> {
    const { id, error, error_code: errorCode } = res || {};
    if (error && errorCode) throw new Error(`Cannot send sms: ${error}, error_code: ${errorCode}`);
    await Sms.upsert({ id, message, phones });
  }
}
