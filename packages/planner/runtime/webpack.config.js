switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod.js');
    break;
  case 'test':
  case 'testing':
    module.exports = require('./config/webpack.test.js');
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev.js');
}
