if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  const cognito = require('./cognito');
  module.exports.strategy = cognito.strategy;
  module.exports.authenticate = cognito.authenticate;
} else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') {
  const basicAuth = require('./basic-auth');
  module.exports.strategy = basicAuth.strategy;
  module.exports.authenticate = basicAuth.authenticate;
} else {
  throw new Error('missing env vars: no authorization configuration found');
}
