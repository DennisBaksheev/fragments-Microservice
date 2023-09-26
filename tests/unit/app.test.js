// Import necessary libraries
const request = require('supertest');
const app = require('../../src/app'); // Adjust the path to your app.js file

// Describe the main test suite
describe('App Tests', () => {
  // Define the test for non-existing routes
  it('should return 404 for non-existing routes', (done) => {
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

  // Define another test for a different non-existing route
  it('should return 404 for another non-existing route', (done) => {
    request(app)
      .get('/another-non-existing-route')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

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

// Describe a new test suite for error handling
describe('Error Handling', () => {
  it('should handle server errors', (done) => {
    request(app)
      .get('/route-that-causes-error') // Assume a route that will cause a server error
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        // Verify the error response
        expect(res.body).toEqual({
          status: 'error',
          error: {
            message: 'unable to process request',
            code: 500,
          },
        });

        done();
      });
  });
});
