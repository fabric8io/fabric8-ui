const merge = require('merge');

module.exports = {
  extends: ['plugin:osio/base', 'airbnb'],

  env: {
    browser: true,
  },

  rules: merge(
    require('./rules/react'),
    require('./rules/jsx-a11y'),
    require('./rules/airbnb-overrides'),
  ),
};
