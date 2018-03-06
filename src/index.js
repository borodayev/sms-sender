// @flow

import Smsc from './Smsc';
import DB from './schema/db';

DB.init();

const login = 'test_dev_kz';
const password = 'test_dev_kz';
const smsc = new Smsc({ login, password });

smsc.sendSms('+77718637484', 'new message').then(res => console.log(res)); // eslint-disable-line no-console
smsc.getStatus(30, '+77718637484').then(res => console.log(res)); // eslint-disable-line no-console
smsc.getCost('+77718637484', 'message').then(res => console.log(res)); // eslint-disable-line no-console
smsc.getBalance().then(res => console.log(res)); // eslint-disable-line no-console

export default Smsc;
