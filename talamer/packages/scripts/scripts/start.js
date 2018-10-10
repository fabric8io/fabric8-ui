process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('./rewire-scripts')(false);

require('react-scripts/scripts/start');
