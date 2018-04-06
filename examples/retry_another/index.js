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

async function send(phone: string, message: string, providerName: string): Promise<any> {
  let provider;
  try {
    provider = providers[providerName];
    const res = await provider.sendSms('77718637484', 'test');
    return res;
  } catch (e) {
    Object.keys(providers).forEach(key => {
      if (providerName !== key) {
        provider = providers[key];
      }
    });
    if (!provider) throw new Error(e);
    const res = await provider.sendSms('77718637484', 'test');
    return res;
  }
}

send('77718637484', 'with_mongoose', 'smsc').then(res => {
  console.log(res);
});
