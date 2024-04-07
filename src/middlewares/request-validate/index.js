const logger = require('../../libraries/log/logger');

function validateRequest(schema) {
  return (req, res, next) => {    
    const validationResult = schema.validate(req.body, { abortEarly: false });

    if (validationResult.error) {
      logger.error('Request validation failed', {
        errors: validationResult.error.details.map(detail => detail.message)
      });
      // Handle validation error
      return res.status(400).json({ 
        errors: validationResult.error.details.map(detail => detail.message)
      });
    }

    // Validation successful - proceed 
    next(); 
  };
}


module.exports = { validateRequest };
