// test unknown endpoints
const request = require('supertest');
const { createExpressApp } = require('../src/server');

let app = null;
beforeAll(async () => {
  app = await createExpressApp();
});
afterAll(async () => {
  app = null;
});

// beforeEach(async () => console.log('1 - beforeEach'));
// afterEach(async () => console.log('1 - afterEach'));

// Test App module
// Test API up and running
describe('App', () => {
  describe('API routes setup completed and running', () => {
    // test unknown endpoints should return 404
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
      expect(response.error.text).toBe('Not Found');
    });
    // test default or root path should return 200
    it('should return 404 for default or root path', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(404);
      expect(response.error).not.toBe(false);
    });
    // test health endpoint (/health) should return 200
    it('should return 200 for health endpoint', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
      expect(response.error).toBe(false);
    });
  });
});
