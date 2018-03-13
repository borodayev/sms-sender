// @flow

// your production credentials for SMSC transporter
export const SMSC_LOGIN = process.env.SMSC_LOGIN || 'test_dev_kz';
export const SMSC_PASSWORD = process.env.SMSC_PASSWORD || 'test_dev_kz123';

// your development credentials for SMSC transporter
export const SMSC_LOGIN_DEV = process.env.SMSC_LOGIN_DEV || 'test_dev_kz';
export const SMSC_PASSWORD_DEV = process.env.SMSC_PASSWORD_DEV || 'test_dev_kz123';

// your production connection with mongoDB
export const MONGO_CONNECTION_PROD =
  process.env.MONGO_CONNECTION_PROD || 'mongodb://frankast:v1v2v3b4@ds255588.mlab.com:55588/smsc';

// your development connection with mongoDB
export const MONGO_CONNECTION_DEV =
  process.env.MONGO_CONNECTION_DEV || 'mongodb://frankast:v1v2v3b4@ds255588.mlab.com:55588/smsc';
