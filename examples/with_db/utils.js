// @flow
/* eslint-disable no-console */

import Smsc from '../../src/transporters/Smsc';
import { SMSC_LOGIN, SMSC_PASSWORD, SMSC_LOGIN_DEV, SMSC_PASSWORD_DEV } from './config';

const transporters = {
  smsc: new Smsc({
    login: SMSC_LOGIN, // PRODUCTION ACCOUNT
    password: SMSC_PASSWORD, // PRODUCTION PASSWORD
  }),
};

export type TransporterNamesT = $Keys<typeof transporters>;

export function getTransport(name?: TransporterNamesT = 'smsc') {
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
