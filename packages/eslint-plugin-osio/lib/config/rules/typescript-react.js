module.exports = {
  // Restrict file extensions that may contain JSX
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
  // Disable JS specific rules
  'react/default-props-match-prop-types': 'off',

  // Use default typescript/member-ordering
  'react/sort-comp': 'off',

  // Breaks typescript-eslint-parser
  'react/jsx-indent': 'off',
  'react/no-typos': 'off',
  'react/jsx-closing-tag-location': 'off',
  'react/jsx-wrap-multilines': 'off',
};
