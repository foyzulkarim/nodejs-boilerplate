const { beforeAll, afterAll } = require("@jest/globals");
const mongoose = require("mongoose");
const { connectWithMongoDb, disconnectWithMongoDb } = require("../src/libraries/db");

beforeAll(async () => {
  await connectWithMongoDb();
});

afterAll(async () => {
  await disconnectWithMongoDb();
});

// test mongoose connection is open

describe("Mongoose connection", () => {
  it("should be open", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
