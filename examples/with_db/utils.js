// @flow
/* eslint-disable no-console */

import { Sms } from './schema/Sms';
import Smsc from '../../src/transporters/Smsc';
import { SMSC_LOGIN, SMSC_PASSWORD, SMSC_LOGIN_DEV, SMSC_PASSWORD_DEV } from './config';

const transporters = {
  smsc: new Smsc({
    login: SMSC_LOGIN, // PRODUCTION ACCOUNT
    password: SMSC_PASSWORD, // PRODUCTION PASSWORD
  }),
};

export type TransporterNames = $Keys<typeof transporters>;

export function getTransport(name?: TransporterNames = 'smsc') {
  if (!transporters.hasOwnProperty(name)) {
    console.error(`Transport '${name}' is not defined.`);
  }

  const transporter = transporters[name];

  if (process.env.NODE_ENV === 'development') {
    return new Smsc({
      login: SMSC_LOGIN_DEV, // DEVELOPMENT ACCOUNT
      password: SMSC_PASSWORD_DEV, // DEVELOPMENT PASSWORD
    });
  }

  return transporter;
}

export async function writeToDB(
  response: any,
  message: string,
  phone: string,
  transportName: string
): Promise<any> {
  const { messageId, rawResponse } = response;
  const { balance, cost, error, error_code: errorCode } = rawResponse || {};

  if (error) throw new Error(`Cannot send sms: ${error}, error_code: ${errorCode}`);

  const fromDB = await Sms.upsert({
    messageId,
    message,
    phone,
    balance,
    cost,
    transporter: transportName,
    rawData: rawResponse,
  });
  return fromDB;
}
