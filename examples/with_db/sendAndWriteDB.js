// @flow

import { getTransport, writeToDB, type TransporterNames } from './utils';

export default async function sendAndWriteDB(
  transportName?: TransporterNames = 'smsc',
  phone: string,
  message: string
): Promise<Object> {
  const transport = getTransport(transportName);
  const response = await transport.sendSms(phone, message);
  const fromDB = await writeToDB(response, message, phone, transportName);
  return fromDB;
}
