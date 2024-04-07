// test unknown endpoints
const request = require('supertest');
const logger = require('../../src/libraries/log/logger');
const { createExpressApp } = require('../../src/server');

let app = null;
beforeAll(async () => {
  console.log('1 - beforeAll');
  app = await createExpressApp();
});
afterAll(async () => {
  console.log('1 - afterAll');
  app = null;
});
beforeEach(async () => console.log('1 - beforeEach'));
afterEach(async () => console.log('1 - afterEach'));

// Test App module
// Test API up and running
describe('Domains.Products', () => {
  // GET /api/v1/products
  describe('GET /api/v1/products', () => {
    it('should return status 200 and a JSON response', async () => {
      const response = await request(app).get('/api/v1/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should log the request with the correct query parameters', async () => {
      const loggerInfoSpy = jest.spyOn(logger, 'info');
      const query = { param1: 'value1', param2: 'value2' };
      await request(app).get('/api/v1/products').query(query);
      expect(loggerInfoSpy).toHaveBeenCalledWith('GET /api/v1/products', {
        query,
      });
    });
  });

  // POST /api/v1/products
  describe('POST /api/v1/products', () => {
    it('should return status 201 and a JSON response', async () => {
      const response = await request(app).post('/api/v1/products').send({
        name: 'Sample Product',
        description: 'This is a sample product for demonstration purposes.',
        price: 19,
        inStock: true,
      });
      
      expect(response.status).toBe(201);
      expect(response.body._id).not.toBeNull();

      // fetch product from database
      const productResponse = await request(app).get(
        `/api/v1/products/${response.body._id}`
      );
      expect(productResponse.status).toBe(200);
      expect(productResponse.body).toEqual(response.body);
    });

    it('should return status 400 if the request body is invalid', async () => {
      const response = await request(app).post('/api/v1/products').send({
        name: 'Product without price',
      });
      expect(response.status).toBe(400);
    });
  });
});
