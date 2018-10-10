process.env.NODE_ENV = 'production';

require('./rewire-scripts')(true);

require('react-scripts/scripts/build');
