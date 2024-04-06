const express = require('express');
const logger = require('../../libraries/log/logger');
// CRUD for product entity
const routes = () => {
  const router = express.Router();
  // GET /api/v1/products
  router.get('/', (req, res) => {
    logger.info('GET /api/v1/products', { query: req.query });
    res.json({ status: 'UP' });
  });

  // POST /products
  router.post('/', (req, res) => {
    res.json({ status: 'UP' });
  });

  // GET /products/:id
  router.get('/:id', (req, res) => {
    res.json({ status: 'UP' });
  });

  // PUT /products/:id
  router.put('/:id', (req, res) => {
    res.json({ status: 'UP' });
  });

  // DELETE /products/:id
  router.delete('/:id', (req, res) => {
    res.json({ status: 'UP' });
  });

  return router;
};

module.exports = { routes };
