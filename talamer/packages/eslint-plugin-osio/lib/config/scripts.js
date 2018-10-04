module.exports = {
  extends: ['plugin:osio/base'],

  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
    'import/order': 'off',
    'no-console': 'off',
    'no-param-reassign': ['error', {props: false}],
    'promise/prefer-await-to-callbacks': 'off',
    'promise/prefer-await-to-then': 'off',
    strict: 'off',
  },
};
