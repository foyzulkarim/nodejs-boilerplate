const express = require('express');
const logger = require('../../libraries/log/logger');
const { AppError } = require('../../libraries/error-handling/AppError');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('./service');

const { createSchema, updateSchema, idSchema } = require('./request');
const { validateRequest } = require('../../middlewares/request-validate');

// CRUD for product entity
const routes = () => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /products', { query: req.query });
    try {
      // TODO: Add pagination and filtering
      const products = await getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    '/',
    validateRequest({ schema: createSchema }),
    async (req, res, next) => {
      logger.info('POST /products', { body: req.body });
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
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      logger.info('GET /products/:id', { params: req.params });
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
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateSchema }),
    async (req, res, next) => {
      logger.info('PUT /products/:id', { params: req.params, body: req.body });
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
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) => {
      logger.info('DELETE /products/:id', { params: req.params });
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
