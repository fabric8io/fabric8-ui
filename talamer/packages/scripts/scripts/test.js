process.env.NODE_ENV = process.env.NODE_ENV || 'test';

require('./rewire-scripts')(false);

require('react-scripts/scripts/test');
