module.exports = {
  // Enforce stateless React Components to be written as a pure function
  // 'react/prefer-stateless-function': ['error', {ignorePureComponents: true}],
  'react/prefer-stateless-function': 'off',

  // Forbid foreign propTypes; forbids using another component's prop types unless they are explicitly imported/exported
  'react/forbid-foreign-prop-types': 'error',

  // Forbid certain propTypes (any, array)
  // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/forbid-prop-types.md
  'react/forbid-prop-types': [
    'error',
    {
      forbid: ['any', 'array'],
      checkContextTypes: true,
      checkChildContextTypes: true,
    },
  ],

  // Restrict file extensions that may contain JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

  // Turning off because sometimes you just want to use 'this.state.foo' or 'this.props.children'
  'react/destructuring-assignment': 'off',
};
