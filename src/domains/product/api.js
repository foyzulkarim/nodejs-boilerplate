const express = require('express');
const logger = require('../../libraries/log/logger');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require('./service');

const { createSchema } = require('./request');
const { validateRequest } = require('../../middlewares/request-validate');

// CRUD for product entity
const routes = () => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /api/v1/products', { query: req.query });
    try {
      const products = await getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', validateRequest(createSchema), async (req, res) => {
    logger.info('POST /api/v1/products', { body: req.body });
    const product = await createProduct(req.body);
    res.status(201).json(product);
  });

  router.get('/:id', async (req, res) => {
    logger.info('GET /api/v1/products/:id', { params: req.params });
    const product = await getProductById(req.params.id);
    res.status(200).json(product);
  });

  router.put('/:id', async (req, res) => {
    res.json({ status: 'UP' });
  });

  router.delete('/:id', async (req, res) => {
    res.json({ status: 'UP' });
  });

  return router;
};

module.exports = { routes };
