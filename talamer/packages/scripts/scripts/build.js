process.env.NODE_ENV = 'production';

require('../lib/rewire-scripts')(true);

require('react-scripts/scripts/build');
