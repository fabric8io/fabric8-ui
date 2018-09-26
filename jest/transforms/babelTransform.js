const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  env: {
    test: {
      presets: [
        // () => require('babel-preset-jest'),
        [
          '@babel/env',
          {
            modules: 'commonjs',
            targets: {
              node: 'current',
            },
          },
        ],
      ],
    },
  },
});
