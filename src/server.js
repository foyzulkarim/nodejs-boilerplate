const config = require("./configs");
const express = require("express");
const helmet = require("helmet");

const defineRoutes = require("./app");
const { errorHandler } = require("./libraries/error-handling");
const logger = require("./libraries/log/logger");
const { addRequestIdMiddleware } = require("./middlewares/request-context");
const { connectWithMongoDb } = require("./libraries/db");

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

  logger.info("Express middlewares are set up");
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  return expressApp;
};

async function startWebServer() {
  logger.info("Starting web server...");
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
    const webServerPort = config.PORT;
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
    if (error && typeof error === "object") {
      if (error.isTrusted === undefined || error.isTrusted === null) {
        error.isTrusted = true;
      }
    }

    errorHandler.handleError(error);
    res.status(error?.HTTPStatus || 500).end();
  });
}

module.exports = { createExpressApp, startWebServer, stopWebServer };
