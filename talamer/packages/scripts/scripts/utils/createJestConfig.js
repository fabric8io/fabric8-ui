const fs = require('fs');
const path = require('path');
const paths = require('../../config/webpack/paths');

// Find a test config by walking up the parent directories.
function locateTsConfig(pathName) {
  const tsConfigTestPath = path.resolve(pathName, 'tsconfig.test.json');
  if (fs.existsSync(tsConfigTestPath)) {
    return tsConfigTestPath;
  }
  const tsConfigPath = path.resolve(pathName, 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    return tsConfigPath;
  }
  if (pathName === '/') {
    return undefined;
  }
  return locateTsConfig(path.resolve(pathName, '../'));
}

module.exports = (resolve, rootDir, srcRoots) => {
  const toRelRootDir = (f) => `<rootDir>/${path.relative(rootDir || '', f)}`;
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? toRelRootDir(paths.testsSetup)
    : resolve('config/jest/setup.js');

  // TODO: I don't know if it's safe or not to just use / as path separator
  // in Jest configs. We need help from somebody with Windows to determine this.
  const config = {
    collectCoverageFrom: ['**/src/**/*.{js,jsx,mjs,ts,tsx}'],
    setupFiles: [resolve('config/webpack/polyfills.js')],
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: ['**/__tests__/**/*.{js,jsx,mjs,ts,tsx}', '**/*.(spec|test).{js,jsx,mjs,ts,tsx}'],
    // where to search for files/tests
    roots: srcRoots.filter((p) => fs.existsSync(p)).map(toRelRootDir),
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx|mjs)$': resolve('config/jest/transforms/babelTransform.js'),
      '^.+\\.tsx?$': resolve('config/jest/transforms/typescriptTransform.js'),
      '^.+\\.css$': resolve('config/jest/transforms/cssTransform.js'),
      '^.+\\.(graphql)$': resolve('config/jest/transforms/graphqlTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|css|json|graphql)$)': resolve(
        'config/jest/transforms/fileTransform.js',
      ),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
    globals: {
      'ts-jest': {
        tsConfigFile: locateTsConfig(paths.appPath),
      },
    },
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  const overrides = require(paths.appPackageJson).jest;
  if (overrides) {
    Object.keys(overrides).forEach((key) => {
      config[key] = overrides[key];
    });
  }
  return config;
};
