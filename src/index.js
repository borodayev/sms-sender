// @flow

import Smsc from './Smsc';
import DB from './schema/db';

DB.init();

const login = 'test_dev_kz';
const password = 'test_dev_kz';
const smsc = new Smsc({ login, password });

smsc.sendSms('+77718637484', 'new message');

export default Smsc;
