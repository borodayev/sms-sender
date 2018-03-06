// @flow
/* eslint-disable no-param-reassign */

import MongoMemoryServer from 'mongodb-memory-server';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

// $FlowFixMe
const DB = require.requireActual('../db').default;

const mongod = new MongoMemoryServer({
  // debug: true,
});

DB.autoIndexOnceInDev = opts => {
  opts.config.autoIndex = false;
};
DB.consoleErr = () => {};
DB.consoleLog = () => {};

const actualInit = DB.init;
DB.init = async () => {
  process.env.MONGODB_GOV_STAT_BIN_URI = await mongod.getConnectionString();
  return actualInit();
};

const actualClose = DB.close;
DB.close = async () => {
  await actualClose();
  mongod.stop();
};

module.exports = DB;

beforeAll(async () => DB.init());
afterAll(async () => DB.close());
