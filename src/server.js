// src/server.js
require('dotenv').config();

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger'); // testing

// Get our express app instance
const app = require('./app');

// Get the desired port from the process environment. Default to `8080`
const port = parseInt(process.env.PORT || 8080, 10);

const server = stoppable(
  app.listen(port, '0.0.0.0', () => {
    // Log a message that the server has started, and which port it's using.
    logger.info(`Server started on http://0.0.0.0:${port}`);
  })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
