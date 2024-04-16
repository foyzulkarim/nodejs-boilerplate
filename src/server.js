const mongoose = require('mongoose');
const http = require('http');
const net = require('net');
const express = require('express');
const helmet = require('helmet');

const loadAndValidateConfig = require('./configs'); // Assuming 'config.js' is in the same directory

const env = process.env.NODE_ENV || 'development';
const config = loadAndValidateConfig(env);
const defineRoutes = require('./app');
const { errorHandler } = require('./libraries/error-handling');
const logger = require('./libraries/log/logger');
const { addRequestIdMiddleware } = require('./middlewares/request-context');

let connection;

const createExpressApp = () => {
  const expressApp = express();
  expressApp.use(addRequestIdMiddleware);
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());

  expressApp.use((req, res, next) => {
    // Log an info message for each incoming request
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  logger.info('Express middlewares are set up');
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  return expressApp;
};

async function startWebServer() {
  logger.info('Starting web server...');
  const expressApp = createExpressApp();
  const APIAddress = await openConnection(expressApp);
  logger.info(`Server is running on ${APIAddress.address}:${APIAddress.port}`);
  await connectWithMongoDb();
  return expressApp;
}

async function stopWebServer() {
  return new Promise((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

async function openConnection(expressApp) {
  return new Promise((resolve) => {
    const webServerPort = process.env.PORT || 4000;
    logger.info(`Server is about to listen to port ${webServerPort}`);

    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address());
    });
  });
}

function defineErrorHandlingMiddleware(expressApp) {
  expressApp.use(async (error, req, res, next) => {
    // Note: next is required for Express error handlers
    if (error && typeof error === 'object') {
      if (error.isTrusted === undefined || error.isTrusted === null) {
        error.isTrusted = true;
      }
    }
    
    errorHandler.handleError(error);
    res.status(error?.HTTPStatus || 500).end();
  });
}

const connectWithMongoDb = async () => {
  const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/express-mongoose';

  logger.info('Connecting to MongoDB...');
  mongoose.connection.once('open', () => {
    logger.info('MongoDB connection is open');
  });
  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', error);
  });

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
    autoCreate: true,
  });
  logger.info('Connected to MongoDB');
};

module.exports = { createExpressApp, startWebServer, stopWebServer };
