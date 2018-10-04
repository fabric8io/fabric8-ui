module.exports = {
  rules: {},
  configs: {
    base: require('./lib/config/base'),
    scripts: require('./lib/config/scripts'),
    jest: require('./lib/config/jest'),
    prettier: require('./lib/config/prettier'),
    node: require('./lib/config/node'),
    react: require('./lib/config/react'),
    typescript: require('./lib/config/typescript'),
    'typescript-prettier': require('./lib/config/typescript-prettier'),
    'typescript-react': require('./lib/config/typescript-react'),
    'typescript-test': require('./lib/config/typescript-test'),
  },
};
