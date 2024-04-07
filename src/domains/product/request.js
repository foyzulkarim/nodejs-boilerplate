const Joi = require('joi');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().optional(),
  inStock: Joi.boolean().optional(),
});

module.exports = { createSchema };
