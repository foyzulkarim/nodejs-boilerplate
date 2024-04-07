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
      expect(response.body).toEqual({ status: 'UP' });
    });

    it('should log the request with the correct query parameters', async () => {
      const loggerInfoSpy = jest.spyOn(logger, 'info');
      const query = { param1: 'value1', param2: 'value2' };
      await request(app).get('/api/v1/products').query(query);
      expect(loggerInfoSpy).toHaveBeenCalledWith('GET /api/v1/products', { query });
    });
  });
});
