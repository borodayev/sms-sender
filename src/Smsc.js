// @flow

import fetch from 'node-fetch';

export type phonesType = string | Array<string>;
// export type sendOpts = {
//   id: number,
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
  constructor(credentials: credentialsType) {
    this.credentials = credentials;
  }

  async send(phones: phonesType, message: string /* options?: sendOpts */): Promise<any> {
    const { password, login } = this.credentials || {};
    if (Array.isArray(phones)) {
      phones = phones.join(','); // eslint-disable-line no-param-reassign
    }
    const res = await fetch(
      `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}`
    );

    return res;
  }
}
