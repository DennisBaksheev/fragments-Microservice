// Import necessary libraries
const request = require('supertest');
const app = require('../../src/app'); // Adjust the path to your app.js file

// Describe the test suite
describe('App Tests', () => {
  // Define the test
  it('should return 404 for non-existing routes', (done) => {
    // Send a GET request to a non-existing route
    request(app)
      .get('/non-existing-route')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        // Check the response body
        expect(res.body).toEqual({
          status: 'error',
          error: {
            message: 'not found',
            code: 404,
          },
        });

        done();
      });
  });
});
