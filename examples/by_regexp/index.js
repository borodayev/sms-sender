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

function getProvider(providerName: string, defaultName?: string = 'smsc'): any {
  const regexp = RegExp(providerName, 'g');
  let provider;
  Object.keys(providers).forEach(name => {
    if (regexp.test(name)) {
      provider = providers[name];
    } else {
      provider = providers[defaultName];
    }
  });

  return provider;
}

const provider = getProvider('sm');

provider.sendSms('77718637484', 'test').then(res => {
  console.log(res);
});
