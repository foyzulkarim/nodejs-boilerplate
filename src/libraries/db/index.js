const mongoose = require("mongoose");
const logger = require("../log/logger");

const { config } = require("../../configs/index");

const connectWithMongoDb = async () => {
  const MONGODB_URI = config.MONGODB_URI;

  logger.info("Connecting to MongoDB...");
  mongoose.connection.once("open", () => {
    logger.info("MongoDB connection is open");
  });
  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error", error);
  });

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    autoCreate: true,
  });
  logger.info("Connected to MongoDB");
};


module.exports = { connectWithMongoDb };
