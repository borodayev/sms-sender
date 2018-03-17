// @flow
/* eslint-disable no-console */

import Smsc from '../../src/transporters/Smsc';
import { Sms } from './schema/Sms';

import DB from './schema/db';

DB.init('mongodb://frankast:v1v2v3b4@ds255588.mlab.com:55588/smsc');

const providers = {
  smsc: new Smsc({
    login: 'test_dev_kz',
    password: 'test_dev_kz123',
  }),
};

Sms.setProviders(providers, 'smsc');

Sms.send('77718637484', 'with_dbasxasx', 'smsc').then(fromDB => {
  console.log('new sms from db ====> ', fromDB);
  fromDB.requestStatus().then(status => console.log('sms status ====> ', status));
});
