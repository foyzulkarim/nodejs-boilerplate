const { beforeAll, afterAll } = require('@jest/globals');
const mongoose = require('mongoose');

beforeAll(async () => {
  console.log('this is the global setup');
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open');
  });
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error', error);
  });
  await mongoose.connect(process.env.MONGODB_URL, {
    autoIndex: true,
    autoCreate: true,
  });
});

afterAll(async () => {
  console.log('this is the global teardown');
  await mongoose.connection.close();
});

// test mongoose connection is open

describe('Mongoose connection', () => {
  it('should be open', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
