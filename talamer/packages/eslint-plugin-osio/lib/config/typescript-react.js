const merge = require('merge');

module.exports = {
  extends: [
    // react should come before typescript due to it using airbnb
    'plugin:osio/react',
    'plugin:osio/typescript',
  ],

  overrides: [
    {
      files: ['**/*.tsx'],
      rules: merge(require('./rules/typescript-react')),
    },
  ],
};
