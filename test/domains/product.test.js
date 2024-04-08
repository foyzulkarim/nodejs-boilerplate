// test unknown endpoints
const request = require('supertest');
const logger = require('../../src/libraries/log/logger');
const { createExpressApp } = require('../../src/server');

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
describe('Domains.Products', () => {
  describe('API', () => {
    // GET /api/v1/products
    describe('GET /api/v1/products', () => {
      it('should return status 200 and a JSON response', async () => {
        const response = await request(app).get('/api/v1/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
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

    // GET /api/v1/products/:id
    describe('GET /api/v1/products/:id', () => {
      it('should return status 400 when id is not valid', async () => {
        const response = await request(app).get('/api/v1/products/123');
        expect(response.status).toBe(400);
      });

      it('should return status 400 if the request params is invalid', async () => {
        const response = await request(app).get('/api/v1/products/invalid-id');
        expect(response.status).toBe(400);
      });
      //id = 66123283c07ca0e7dcc37990
      it('should return status 404 if the product is not found', async () => {
        const response = await request(app).get(
          '/api/v1/products/66123283c07ca0e7dcc37990'
        );
        expect(response.status).toBe(404);
      });
    });

    // PUT /api/v1/products/:id
    describe('PUT /api/v1/products/:id', () => {
      it('should return status 400 when id is not valid', async () => {
        const response = await request(app).put('/api/v1/products/123');
        expect(response.status).toBe(400);
      });

      it('should return status 400 if the request params is invalid', async () => {
        const response = await request(app).put('/api/v1/products/invalid-id');
        expect(response.status).toBe(400);
      });

      it('should return status 404 if the product is not found', async () => {
        const response = await request(app).put(
          '/api/v1/products/66123283c07ca0e7dcc37990'
        );
        expect(response.status).toBe(404);
      });

      it('should return status 400 if the request body is invalid', async () => {
        const response = await request(app)
          .put('/api/v1/products/66123283c07ca0e7dcc37990')
          .send({
            _id: '66123283c07ca0e7dcc37990',
            name: 'Product without price',
          });
        expect(response.status).toBe(400);
      });

      // create and then update the product and then assert the response
      it('should return status 200 and a JSON response', async () => {
        const createResponse = await request(app)
          .post('/api/v1/products')
          .send({
            name: 'Sample Product',
            description: 'This is a sample product for demonstration purposes.',
            price: 19,
            inStock: true,
          });

        const updateResponse = await request(app)
          .put(`/api/v1/products/${createResponse.body._id}`)
          .send({
            name: 'Updated Product',
            description:
              'This is an updated product for demonstration purposes.',
            price: 29,
            inStock: false,
          });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body._id).toBe(createResponse.body._id);
        expect(updateResponse.body.name).toBe('Updated Product');
        expect(updateResponse.body.price).toBe(29);
        expect(updateResponse.body.inStock).toBe(false);

        // fetch product from database via GET /products/:id
        const productResponse = await request(app).get(
          `/api/v1/products/${createResponse.body._id}`
        );
        expect(productResponse.status).toBe(200);
        expect(productResponse.body).toEqual(updateResponse.body);
      });
    });

    // DELETE /api/v1/products/:id
    describe('DELETE /api/v1/products/:id', () => {
      it('should return status 400 when id is not valid', async () => {
        const response = await request(app).delete('/api/v1/products/123');
        expect(response.status).toBe(400);
      });

      it('should return status 400 if the request params is invalid', async () => {
        const response = await request(app).delete(
          '/api/v1/products/invalid-id'
        );
        expect(response.status).toBe(400);
      });

      it('should return status 204 if the product is successfully deleted', async () => {
        const createResponse = await request(app)
          .post('/api/v1/products')
          .send({
            name: 'Sample Product',
            description: 'This is a sample product for demonstration purposes.',
            price: 19,
            inStock: true,
          });

        const deleteResponse = await request(app).delete(
          `/api/v1/products/${createResponse.body._id}`
        );
        expect(deleteResponse.status).toBe(204);

        // fetch product from database via GET /products/:id
        const productResponse = await request(app).get(
          `/api/v1/products/${createResponse.body._id}`
        );
        expect(productResponse.status).toBe(404);
      });
    });
  });
});
