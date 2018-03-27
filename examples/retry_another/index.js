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

async function retryAnother(phone: string, message: string, providerName: string): Promise<any> {
  let provider = providers.smsc;
  Object.keys(providers).forEach(name => {
    if (name !== providerName) {
      provider = providers[name];
    }
  });

  const res = await provider.sendSms(phone, message);
  return res;
}

async function send(phone: string, message: string, providerName: string): Promise<any> {
  const provider = providers[providerName];

  const res = await provider.sendSms('77718637484', 'test');
  const { messageId } = res;
  const status = await provider.getStatus(messageId);
  if (status === 'ok') {
    return res;
  }
  const res2 = await retryAnother(phone, message, providerName);
  return res2;
}

send('77718637484', 'with_db', 'smsc').then(res => {
  console.log(res);
});
