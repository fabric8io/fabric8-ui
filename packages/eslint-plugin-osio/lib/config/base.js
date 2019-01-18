const merge = require('merge');

module.exports = {
  extends: ['airbnb-base'],

  plugins: ['promise', 'sort-class-members'],

  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    es6: true,
  },

  rules: merge(
    require('./rules/promise'),
    require('./rules/sort-class-members'),
    require('./rules/airbnb-overrides'),
  ),
};
