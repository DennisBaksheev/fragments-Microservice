const request = require('supertest');
const app = require('../../src/app'); // Import your Express app instance

describe('Routes Tests', () => {
  describe('/v1/fragments route', () => {
    it('should return 401 Unauthorized without authentication', async () => {
      const response = await request(app).post('/v1/fragments').send('Test data');
      expect(response.status).toBe(401);
    });

    // Commented out test
    /*
    it('should return 201 Created with valid authentication', async () => {
      // Here, you'll need to provide a valid authentication header or token
      // For this example, using Basic Auth:
      const auth = 'Basic ' + Buffer.from('username:password').toString('base64');
      const response = await request(app)
        .post('/v1/fragments')
        .set('Authorization', auth)
        .send('Test data');
      expect(response.status).toBe(201);
    });
    */
  }); // Closing bracket for the inner describe block
}); // Closing bracket for the outer describe block
