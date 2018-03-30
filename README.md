# sms-sender

[![travis build](https://img.shields.io/travis/FrankAst/sms-sender.svg)](https://travis-ci.org/FrankAst/sms-sender)
[![codecov coverage](https://img.shields.io/codecov/c/github/FrankAst/sms-sender.svg)](https://codecov.io/github/FrankAst/sms-sender)
[![](https://img.shields.io/npm/v/sms-sender.svg)](https://www.npmjs.com/package/sms-sender)
<!-- [![npm](https://img.shields.io/npm/dt/graphql-compose-json.svg)](http://www.npmtrends.com/graphql-compose-json) -->
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![Greenkeeper badge](https://badges.greenkeeper.io/graphql-compose/graphql-compose-json.svg)](https://greenkeeper.io/) -->
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


This is a wrapper for [AWS.SNS](https://aws.amazon.com/sns/) and [SMSC API](https://smsc.ru).

## Installation


```bash
yarn add @frankast/sms-sender
```

## Example

There are two providers `Smsc.js` (default) and `Sns.js`. If you want to use `Sns.js` do not forget to add `aws-sdk` optional dependency.

Here is an example for using this wrapper with RegExp:

```js
// @flow

import Smsc from '../../src/transporters/Smsc';
import Sns from '../../src/transporters/Sns';

// don't forget to put your credentials
const providers = {
  smsc: new Smsc({
    login: '',
    password: '',
  }),

// put here or in ~/.aws/credentials
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

provider.sendSms('77718637484', 'test').then(res => console.log(res));

```

Other examples are available in [./examples](https://github.com/FrankAst/sms-sender/tree/master/examples).

## Contribution
Feel free to submit pull request to us. Also, be sure all tests has passed otherwise pull request won't be accepted.

## License

[MIT](https://github.com/FrankAst/sms-sender/blob/master/LICENSE.md)
