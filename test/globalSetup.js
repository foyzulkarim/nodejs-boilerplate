// import { MongoMemoryServer } from 'mongodb-memory-server';
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    instance: {
      dbName: 'testdb',
    },
  });
  const uri = instance.getUri();
  global.__MONGOINSTANCE = instance;
  process.env.MONGODB_URL = uri.slice(0, uri.lastIndexOf('/'));
};
