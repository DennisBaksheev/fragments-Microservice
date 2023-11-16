const express = require('express');

// version and author from package.json
//const { version, author } = require('../../package.json');

// Import the response handling functions
//const { createSuccessResponse } = require('../response');

// Import the authentication middleware
const { authenticate } = require('../authorization');

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use('/v1', authenticate(), require('./api'));

module.exports = router;
