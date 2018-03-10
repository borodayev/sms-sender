/* @flow */

export type SendSmsParamsT = {|
  phones: string,
  cost: 0 | 1 | 2 | 3,
  mes: string,
  fmt: 0 | 1 | 2 | 3,
  sender: string,
  tinyurl: 0 | 1,
  time: Date,
  tz: number,
  flash: 0 | 1,
  charset: 'utf-8',
  translit: 0 | 1 | 2,
|};

export type SendSmsResponseT = {|
  messageId: string,
  cost?: number,
  status?: 'ok' | 'error' | 'pending',
  response: mixed, // vanila response from transporter
|};

export type CredentialsT = {|
  login: string,
  password: string,
|};

export type GetStatusOutputT = {
  last_date: string,
  last_timestamp: number,
  status: number,
};
