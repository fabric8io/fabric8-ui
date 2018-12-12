// eslint-disable-next-line node/no-extraneous-require
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [require.resolve('babel-preset-react-app')],
});
