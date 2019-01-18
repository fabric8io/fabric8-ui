module.exports = {
  rules: {},
  configs: {
    // when extending add to list using the following order:
    base: require('./lib/config/base'),
    react: require('./lib/config/react'),
    typescript: require('./lib/config/typescript'),

    scripts: require('./lib/config/scripts'),
    jest: require('./lib/config/jest'),
    node: require('./lib/config/node'),

    prettier: require('./lib/config/prettier'),
  },
};
