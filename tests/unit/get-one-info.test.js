// tests/unit/get-one-info.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () => {
    await request(app).get('/v1/fragments/:id/info').expect(401);
  });

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', async () => {
    await request(app)
      .get('/v1/fragments/:id/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  // Authenticated users can get info
  test('authenticated users can get info', async () => {
    // Create a fragment
    const postRes = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'Dennis123!')
      .send('a fragment');

    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragments.id;

    // Fetch fragment info
    const resGet = await request(app)
      .get(`/v1/fragments/${fragmentId}/info`)
      .auth('user1@email.com', 'Dennis123!');

    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.status).toBe('ok');

    // Check for the presence and correctness of all fields
    const fragmentInfo = resGet.body.fragment;
    expect(fragmentInfo.id).toBe(fragmentId);
    expect(fragmentInfo.ownerId).toBeTruthy();
    expect(new Date(fragmentInfo.created)).not.toBeNaN();
    expect(new Date(fragmentInfo.updated)).not.toBeNaN();
    expect(fragmentInfo.type).toBe('text/plain');
    expect(typeof fragmentInfo.size).toBe('number');
  });

  // Error if ID does not exist
  test('error if id not exist', async () => {
    await request(app).get(`/v1/fragments/abc/info`).auth('user1@email.com', 'Dennis123!').expect(404);
  });
});
