const Joi = require('joi');
const mongoose = require('mongoose');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  inStock: Joi.boolean().optional(),
});

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  inStock: Joi.boolean(),
});

const idSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .required(),
});

module.exports = { createSchema, updateSchema, idSchema };
