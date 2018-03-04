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
export type CredentialsType = {
  login: string,
  password: string,
};

export type SendSmsOutputType = {
  balance: number,
  cnt: number,
  cost: number,
  id: number,
};

export type GetCostOutputType = {
  cnt: number,
  cost: number,
};

export type GetStatusOutputType = {
  last_date: string,
  last_timestamp: number,
  status: number,
};

export type GetBalanceOutputType = {
  balance: number,
};

export default class Smsc {
  credentials: CredentialsType;

  constructor(credentials: CredentialsType) {
    this.credentials = credentials;
  }

  async sendSms(
    phones: PhonesType,
    message: string /* options?: sendOpts */
  ): Promise<SendSmsOutputType> {
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    try {
      const res = await fetch(
        `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=3`
      );

      const resJSON = await res.json();
      await writeToDB(resJSON, message, phones);

      return resJSON;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getCost(phones: PhonesType, message: string): Promise<GetCostOutputType> {
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

  async getStatus(id: number, phones: PhonesType): Promise<GetStatusOutputType> {
    const { password, login } = this.credentials || {};
    phones = preparePhones(phones);
    try {
      const res = await fetch(
        `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phones}&id=${id}&fmt=3`
      );

      const resJSON = await res.json();
      return resJSON;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getBalance(): Promise<GetBalanceOutputType> {
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
