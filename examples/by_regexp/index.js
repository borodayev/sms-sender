// @flow
/* eslint-disable no-console */

import Smsc from '../../src/transporters/Smsc';
import Sns from '../../src/transporters/Sns';

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

async function send(phone: string, message: string): Promise<Object> {
  const regexp = RegExp('7708', 'g');
  let provider;
  if (regexp.test(phone)) {
    provider = providers.smsc;
  } else {
    provider = providers.sns;
  }
  const res = await provider.sendSms(phone, message);
  return res;
}

send('+77081113344', 'hello world').then(res => {
  console.log(res);
});
