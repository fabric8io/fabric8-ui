const merge = require('merge');

module.exports = {
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: 'typescript-eslint-parser',

      plugins: ['typescript'],

      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },

      rules: merge(require('./rules/typescript')),
    },
  ],
};
