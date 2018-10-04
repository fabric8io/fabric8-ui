module.exports = {
  extends: ['prettier'],

  plugins: ['prettier'],

  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
        jsxBracketSameLine: false,
        arrowParens: 'always',
        printWidth: 100,
      },
    ],
  },
};
