// @flow
// eslint-disable no-console

import Smsc from '../src/transporters/Smsc';

const login = 'test_dev_kz';
const password = 'test_dev_kz';
const smsc = new Smsc({ login, password });

smsc.sendSms({ phones: '77718637484', mes: 'new message', fmt: 3 }).then(res => console.log(res));
// smsc.getStatus(30, '+77718637484').then(res => console.log(res));
// smsc.getCost('+77718637484', 'message').then(res => console.log(res));
// smsc.getBalance().then(res => console.log(res));

export default Smsc;
