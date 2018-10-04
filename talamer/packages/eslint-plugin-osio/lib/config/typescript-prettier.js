module.exports = {
  extends: ['plugin:osio/prettier'],

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            parser: 'typescript',
            singleQuote: true,
            trailingComma: 'all',
            bracketSpacing: false,
            jsxBracketSameLine: false,
            arrowParens: 'always',
            printWidth: 100,
          },
        ],
      },
    },
  ],
};
