/* @flow */

export type SendSmsResponse = {|
  messageId: string,
  cost: number,
  status: 'ok' | 'error' | 'pending',
  response: mixed, // vanila response from transporter
|};
