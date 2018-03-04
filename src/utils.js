// @flow
/* eslint-disable no-param-reassign */

import { Sms } from './schema/Sms';
import { type PhonesType } from './Smsc';

export async function writeToDB(res: any, message: string, phones: PhonesType): Promise<any> {
  const { id, balance, cost, error, error_code: errorCode } = res || {};
  if (error) throw new Error(`Cannot send sms: ${error}, error_code: ${errorCode}`);
  if (!Array.isArray(phones)) phones = phones.split(',');
  const fromDB = await Sms.upsert({ id, message, phones, balance, cost });
  return fromDB;
}

export function preparePhones(phones: PhonesType): string {
  if (Array.isArray(phones)) {
    phones = phones.join(',');
  }
  return phones;
}
