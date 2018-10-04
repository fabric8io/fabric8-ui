// see https://github.com/evcohen/eslint-plugin-jsx-a11y

module.exports = {
  // Enforce that <label> elements have the htmlFor prop or nesting.
  'jsx-a11y/label-has-for': [
    'error',
    {
      components: ['Label'],
      required: {
        some: ['nesting', 'id'],
      },
      allowChildren: false,
    },
  ],
};
