const express = require('express');
const logger = require('../../libraries/log/logger');
const { AppError } = require('../../libraries/error-handling/AppError');

const {
  createProduct,
  filterProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('./service');

const { createSchema, updateSchema, idSchema } = require('./request');
const { validateRequest } = require('../../middlewares/request-validate');
const { logRequest } = require('../../middlewares/log');

// CRUD for product entity
const routes = () => {
  const router = express.Router();
  logger.info('Setting up product routes');
  router.get('/', logRequest({}), async (req, res, next) => {
    try {
      // TODO: Add pagination and filtering
      const products = await filterProducts(req.query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    '/',
    logRequest({}),
    validateRequest({ schema: createSchema }),
    async (req, res, next) => {
      try {
        const product = await createProduct(req.body);
        res.status(201).json(product);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    '/:id',
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      try {
        const product = await getProductById(req.params.id);
        if (!product) {
          throw new AppError('Product not found', 'Product not found', 404);
        }
        res.status(200).json(product);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    '/:id',
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateSchema }),
    async (req, res, next) => {
      try {
        const product = await updateProductById(req.params.id, req.body);
        if (!product) {
          throw new AppError('Product not found', 'Product not found', 404);
        }
        res.status(200).json(product);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    '/:id',
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      try {
        await deleteProductById(req.params.id);
        res.status(204).json({ message: 'Product deleted' });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

module.exports = { routes };
