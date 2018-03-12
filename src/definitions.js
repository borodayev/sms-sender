// @flow

export type SendSmsParamsT = {|
  phones: string,
  cost?: 1 | 2 | 3,
  mes: string,
  fmt?: 1 | 2 | 3,
  sender?: string,
  tinyurl?: 1,
  time?: Date,
  tz?: number,
  flash?: 1,
  charset?: 'utf-8',
  translit?: 1 | 2,
|};

export type SendSmsResponseT = {|
  messageId: string,
  cost?: number,
  status?: 'ok' | 'error' | 'pending',
  response: mixed, // vanila response from transporter
|};

export type GetCostParamsT = {|
  phones: string,
  mes: string,
  fmt?: 1 | 2 | 3,
|};

export type GetCostResponseT = {|
  cost: number,
  response: mixed, // vanila response from transporter
|};

export type GetStatusResponseT = {|
  status: string,
  response: mixed, // vanila response from transporter
|};

export type GetBalanceParamsT = {|
  cur?: boolean,
  fmt?: 1 | 2 | 3,
|};

export type CredentialsT = {|
  login: string,
  password: string,
|};
