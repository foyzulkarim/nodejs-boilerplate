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
  // const uri = instance.getUri();
  // process.env.MONGODB_URL = uri.slice(0, uri.lastIndexOf('/'));
};
