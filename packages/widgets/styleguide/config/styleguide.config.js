const path = require('path');
const packageName = require('../../package.json').name;

module.exports = {
  styleguideDir: path.join(__dirname, '../../dist/styleguide'),
  title: 'OpenShift.io UI Components',
  usageMode: 'expand',
  assetsDir: path.join(__dirname, '../../styleguide/assets'),
  propsParser: require('react-docgen-typescript').parse,
  webpackConfig: require('@osio/scripts/config/webpack/webpack.config.dev'),
  getComponentPathLine(componentPath) {
    const componentName = path.basename(componentPath, '.tsx');
    return `import { ${componentName} } from '${packageName}';`;
  },
  components: '../../src/components/**/*.tsx',
  sections: [
    {
      name: 'Introduction',
      content: path.join(__dirname, '../../README.md'),
    },
    {
      name: 'Components',
      components: path.join(__dirname, '../../src/components/**/*.tsx'),
    },
  ],
};
