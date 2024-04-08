const logger = require('../../libraries/log/logger');

function validateRequest({ schema, isParam = false }) {
  return (req, res, next) => {
    const input = isParam ? req.params : req.body;
    const validationResult = schema.validate(input, { abortEarly: false });

    if (validationResult.error) {
      logger.error(`${req.method} ${req.originalUrl} Validation failed`, {
        errors: validationResult.error.details.map((detail) => detail.message),
      });
      // Handle validation error
      return res.status(400).json({
        errors: validationResult.error.details.map((detail) => detail.message),
      });
    }

    // Validation successful - proceed
    next();
  };
}

module.exports = { validateRequest };
