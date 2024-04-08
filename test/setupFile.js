const { beforeAll, afterAll } = require('@jest/globals');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    autoIndex: true,
    autoCreate: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

// test mongoose connection is open

describe('Mongoose connection', () => {
  it('should be open', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
