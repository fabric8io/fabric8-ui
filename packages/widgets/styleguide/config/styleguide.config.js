const path = require('path');
const merge = require('webpack-merge');
const config = require('@osio/scripts/config/webpack/webpack.config.dev');
const fs = require('fs');

const packageName = require('../../package.json').name;

function findFileCaseInsensitive(filepath) {
  const dir = path.dirname(filepath);
  const fileNameLower = path.basename(filepath).toLowerCase();
  const files = fs.readdirSync(dir);
  const found = files.find((file) => file.toLowerCase() === fileNameLower);
  return found && path.join(dir, found);
}

module.exports = {
  styleguideDir: path.join(__dirname, '../../dist/styleguide'),
  title: 'CodeReady Toolchain UI Components',
  usageMode: 'expand',
  assetsDir: path.join(__dirname, '../../styleguide/assets'),
  propsParser: require('react-docgen-typescript').parse,
  webpackConfig: merge(config, {
    resolve: {
      alias: {
        [packageName]: path.join(__dirname, '../../'),
      },
    },
  }),
  require: [
    path.join(__dirname, '../../src/base.scss'),
    path.join(__dirname, '../assets/styleguide.css'),
  ],
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
      components: path.join(__dirname, '../../src/**/*.tsx'),
    },
  ],
  getExampleFilename(componentPath) {
    const files = [
      path.join(path.dirname(componentPath), 'Readme.md'),
      // ComponentName.md
      componentPath.replace(path.extname(componentPath), '.md'),
      // FolderName.md when component definition file is index.js
      // path.join(path.dirname(componentPath), `${path.basename(path.dirname(componentPath))}.md`),
    ];
    // eslint-disable-next-line
    for (const file of files) {
      const existingFile = findFileCaseInsensitive(file);
      if (existingFile) {
        return existingFile;
      }
    }
    return false;
  },
};
