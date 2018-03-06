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
export type CredentialsT = {
  login: string,
  password: string,
};

export type SendSmsOutputT = {
  cnt: number, // number of sms messages
  id: number, // message id
  cost: number, // sms cost
  balance: number, // account balance after message sending
};

// TODO tinyurl - 0, 1
// TODO translit
// TODO charset=utf-8

export type GetStatusOutputT = {
  last_date: string,
  last_timestamp: number,
  status: number,
};

export default class Smsc {
  credentials: CredentialsT;

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  async _send(params: Object): Promise<Object> {
    // TODO combine url via https://nodejs.org/api/url.html
    const res = await fetch(
      `http://smsc.ru/sys/send.php?login=${this.credentials.login}&psw=${this.credentials.password}&phones=${phones}&mes=${message}&fmt=3&cost=1`
    );
    return res.json();
  }

  async sendSms(
    phones: PhonesType, // TODO string (one phone number)
    message: string /* options?: sendOpts */
  ): Promise<SendSmsOutputT> {
    const formatedPhones = preparePhones(phones);
    const res = this._send({
      phones: formatedPhones,
      mes: message,
      fmt: 3,
      cost: 3,
      ...sendOpts,
    });

    await writeToDB(res, message, phones);

    return resJSON;
  }

  // cost: number
  // response: mixed, // vanila response from transporter
  async getCost(phone: PhonesType, message: string): Promise<number> {
    // TODO: return only cost
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    try {
      const res = await fetch(
        `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=1`
      );
      const resJSON = await res.json();
      return resJSON;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getStatus(messageId: number): Promise<GetStatusOutputT> {
    const { password, login } = this.credentials || {};

    // TODO 30-77718637484 split messageId and phone number

    phones = preparePhones(phones);
    try {
      const res = await fetch(
        `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phones}&id=${messageId}&fmt=3`
      );

      const resJSON = await res.json();
      return resJSON;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getBalance(): Promise<number> {
    const { password, login } = this.credentials || {};
    try {
      const res = await fetch(
        `http://smsc.ru/sys/balance.php?login=${login}&psw=${password}&fmt=3`
      );
      const resJSON = await res.json();
      return resJSON;
    } catch (e) {
      throw new Error(e);
    }
  }
}
