// @flow
/* eslint-disable no-console */

import Smsc from '../../src/transporters/Smsc';
import Sns from '../../src/transporters/Sns';
import { Sms } from './schema/Sms';

import DB from './schema/db';

// put here your mongo connection
DB.init('MONGO_CONNECTION_STRING');

// don't forget to put your credentials
const providers = {
  smsc: new Smsc({
    login: '',
    password: '',
  }),

  sns: new Sns({
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
  }),
};

Sms.setProviders(providers, 'smsc');

Sms.send('77718637484', 'with_db', 'smsc').then(fromDB => {
  console.log('new sms from db ====> ', fromDB);
  fromDB.requestStatus().then(status => console.log('sms status ====> ', status));
});
