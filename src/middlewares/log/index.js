const logger = require('../../libraries/log/logger');

// Middleware to log the request.
// Logic: by default it will log req.params and req.query if they exist.
// for the req.body, if no specific fields are provided in the fields, it will log the entire body.
const logRequest = ({ fields = {} }) => {
  return (req, res, next) => {
    const logData = {};
    if (req.params) {
      logData.params = req.params;
    }
    if (req.query) {
      logData.query = req.query;
    }
    if (req.body) {
      if (fields && fields.length) {
        fields.forEach((field) => {
          logData[field] = req.body[field];
        });
      } else {
        logData.body = req.body;
      }
    }
    logger.info(`${req.method} ${req.originalUrl}`, logData);

    // Store the original end method
    const oldEnd = res.end;
    // Override the end method
    res.end = function (...args) {
      // Log the status code after the original end method is called
      logger.info(`${req.method} ${req.originalUrl}`, {
        statusCode: res.statusCode,
      });
      oldEnd.apply(this, args);
    };

    next();
  };
};

module.exports = { logRequest };
