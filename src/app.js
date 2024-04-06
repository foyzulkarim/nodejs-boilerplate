const express = require('express');
const logger = require('./libraries/log/logger');
const domainRoutes = require('./domains/index');

function defineRoutes(expressApp) {
  logger.info('Defining routes...');
  const router = express.Router();

  domainRoutes(router);

  expressApp.use('/api/v1', router);
  // health check
  expressApp.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  logger.info('Routes defined');
}

module.exports = defineRoutes;
