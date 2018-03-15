// @flow
/* eslint-disable no-console */

import { Sms } from './schema/Sms';
import DB from './schema/db';

DB.init();

Sms.send('77718637484', 'with_sdb', 'smsc').then(fromDB => {
  console.log('new sms from db ====> ', fromDB);
  fromDB.requestStatus().then(r => console.log('sms status ====> ', r));
});
