module.exports = {
  extends: ['plugin:osio/typescript'],

  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'typescript/no-non-null-assertion': 'off',
      },
    },
  ],
};
