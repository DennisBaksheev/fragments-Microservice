const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () =>
        request(app).get('/v1/fragments/:id').expect(401));

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
        request(app)
            .get('/v1/fragments/:id')
            .auth('invalid@email.com', 'incorrect_password')
            .expect(401));

    test('authenticated users can get data', async () => {
        const res = await request(app)
            .post('/v1/fragments')
            .set('Content-Type', 'text/plain')
            .auth('user1@email.com', 'Dennis123!')
            .send('a fragment');

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('ok');

        const resGet = await request(app)
            .get(`/v1/fragments/${res.body.fragments.id}`)
            .auth('user1@email.com', 'Dennis123!');
        expect(resGet.statusCode).toBe(200);
    });

    test('markdown can be converted to html', async () => {
        const res = await request(app)
            .post('/v1/fragments')
            .set('Content-Type', 'text/markdown')
            .auth('user1@email.com', 'Dennis123!')
            .send('#a fragment');

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('ok');

        const resGet = await request(app)
            .get(`/v1/fragments/${res.body.fragments.id}.html`)
            .auth('user1@email.com', 'Dennis123!');
        expect(resGet.statusCode).toBe(200);
    });

    test('error if id not exist', async () => {
        const resGet = await request(app).get(`/v1/fragments/abc`).auth('user1@email.com', 'Dennis123!');
        expect(resGet.statusCode).toBe(404);
    });

    test('fragment can be converted to plain text', async () => {
        // Create and post a markdown fragment
        const postRes = await request(app)
            .post('/v1/fragments')
            .set('Content-Type', 'text/markdown')
            .auth('user1@email.com', 'Dennis123!')
            .send('# Markdown Fragment');

        expect(postRes.statusCode).toBe(201);

        // Request the fragment as plain text
        const getRes = await request(app)
            .get(`/v1/fragments/${postRes.body.fragments.id}.txt`)
            .auth('user1@email.com', 'Dennis123!');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.text).toContain('# Markdown Fragment'); // Check if the content is as expected
    });

    test('error on unsupported conversion', async () => {
        // Create and post a plain text fragment
        const postRes = await request(app)
            .post('/v1/fragments')
            .set('Content-Type', 'text/plain')
            .auth('user1@email.com', 'Dennis123!')
            .send('Plain text fragment');

        expect(postRes.statusCode).toBe(201);

        // Try to get the fragment with an unsupported conversion (e.g., .html for plain text)
        const getRes = await request(app)
            .get(`/v1/fragments/${postRes.body.fragments.id}.html`)
            .auth('user1@email.com', 'Dennis123!');

        expect(getRes.statusCode).toBe(415);
    });
});
