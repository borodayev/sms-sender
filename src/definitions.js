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
  response: mixed, // vanila response from transporter
|};

export type DeleteSmsParamsT = {|
  fmt?: 1 | 2 | 3,
|};

export type DeleteSmsResponseT = {|
  result: string,
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

export type GetStatusParamsT = {|
  fmt?: 1 | 2 | 3,
  all?: 1 | 2,
  charset?: 'utf-8',
|};

export type GetStatusResponseT = {|
  status: number,
  response: mixed, // vanila response from transporter
|};

export type GetBalanceParamsT = {|
  cur?: 1,
  fmt?: 1 | 2 | 3,
|};

export type CredentialsT = {|
  login: string,
  password: string,
|};
