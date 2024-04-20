// import { MongoMemoryServer } from 'mongodb-memory-server';
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    instance: {
      dbName: 'testdb',
      port: 27018,
    },
  });
  global.__MONGOINSTANCE = instance;
};
