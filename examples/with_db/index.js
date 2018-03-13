// @flow
/* eslint-disable no-console */

import sendAndWriteDB from './sendAndWriteDB';
import DB from './schema/db';

DB.init();

sendAndWriteDB('smsc', '77718637484', 'new messsage')
  .then(fromDB => console.log(fromDB))
  .catch(e => {
    console.error(e);
  });
