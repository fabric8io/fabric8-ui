module.exports = {
  'import/prefer-default-export': 'off',

  'object-curly-spacing': ['error', 'always'],

  // max line length
  'max-len': ['error', { code: 100, comments: 100, ignoreUrls: true }],

  'no-plusplus': 'off',

  'func-names': 'off',

  'class-methods-use-this': 'off',

  'no-return-assign': ['error', 'except-parens'],

  'react/jsx-one-expression-per-line': 'off',

  // Disallow nested ternary expressions
  'no-nested-ternary': 'off',

  // disallow reassignment of function parameters
  'no-param-reassign': [
    'error',
    {
      props: false,
    },
  ],
};
