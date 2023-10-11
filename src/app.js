// src/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const basicAuth = require('./auth/basic-auth');

// Import the selected strategy and authenticate function from src/auth/index.js
const { strategy, authenticate } = require('./auth/cognito');

const { author, version } = require('../package.json');
const logger = require('./logger');
const pino = require('pino-http')({
  // Use our default logger instance, which is already configured
  logger,
});

// Import the response handling functions
const { createSuccessResponse, createErrorResponse } = require('./response');

const contentType = require('content-type');
const Fragment = require('./Model/fragment');

const rawBody = () => {
  return express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });
};

// Create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware so we can make requests across origins
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Set up our passport authentication middleware
passport.use('bearer', strategy());
passport.use('http', basicAuth.strategy());
app.use(passport.initialize());

// Create a router that we can use to mount our API
const router = express.Router();

router.post('/fragments', authenticate(), rawBody(), (req, res) => {
  if (Buffer.isBuffer(req.body)) {
    Fragment.setFragment(/*...*/)
      .then((fragmentId) => {
        // Assuming the promise resolves with the fragmentId
        logger.info(`Fragment created successfully with id: ${fragmentId}`);

        // Set the Location header with the URL to GET the fragment
        const fragmentLocation = process.env.API_URL
          ? `${process.env.API_URL}/fragments/${fragmentId}`
          : `http://${req.headers.host}/fragments/${fragmentId}`;
        res.setHeader('Location', fragmentLocation);

        res.status(201).send('Fragment created');
      })
      .catch((err) => {
        logger.error('Error saving fragment:', err);
        res.status(500).send('Error saving fragment');
      });
  } else {
    logger.warn('Attempt to create fragment with unsupported content type.');
    res.status(400).send('Unsupported content type');
  }
});

// Expose all of our API routes on /v1/* to include an API version.
// Protect them all so you have to be authenticated in order to access.
router.use('/v1', authenticate(), require('./routes/api'));

// Define a simple health check route.
// Define a simple health check route.
router.get('/healthcheck', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/DennisBaksheev/fragments',
      version,
    })
  );
});

// Define our routes
app.use('/', router);

// Add 404 middleware to handle any requests for resources that can't be found
app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json(createErrorResponse(status, message));
});

// Export our `app` so we can access it in server.js
module.exports = app;
console.log('Express app loaded.');
