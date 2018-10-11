process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('../lib/rewire-scripts')(false);

require('react-scripts/scripts/start');
