const {CheckerPlugin} = require('awesome-typescript-loader');
const fs = require('fs');
const path = require('path');

process.env.SKIP_PREFLIGHT_CHECK = true;

function rewireEnv() {
  // load env before paths because env will clear the module cache for paths
  require('react-scripts/config/env');
}

function rewirePaths() {
  require('react-scripts/config/env');

  const paths = require('react-scripts/config/paths');

  if (!fs.existsSync(paths.appIndexJs)) {
    paths.appIndexJs = path.resolve(paths.appPath, 'src/index.ts');
  }
  if (!fs.existsSync(paths.appPublic)) {
    paths.appPublic = path.resolve(__dirname, '../config/webpack/public');
    paths.appHtml = path.resolve(paths.appPublic, 'index.html');
  }

  require.cache[require.resolve('react-scripts/config/paths')].exports = paths;
}

function rewireWebpack(prod) {
  const paths = require('react-scripts/config/paths');
  const webpackConfig = `react-scripts/config/webpack.config.${prod ? 'prod' : 'dev'}.js`;
  const config = require(webpackConfig);
  config.module.rules[1] = {
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
          useEslintrc: true,
        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    include: paths.appSrc,
  };

  const {oneOf} = config.module.rules[2];
  oneOf.unshift({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
    ],
  });

  oneOf[oneOf.length - 1].exclude = [/\.(ts|tsx|js|jsx|mjs)$/, /\.html$/, /\.json$/];
  config.plugins.push(new CheckerPlugin());

  config.resolve.extensions = [
    '.mjs',
    '.web.js',
    '.js',
    '.json',
    '.web.jsx',
    '.jsx',
    '.ts',
    '.tsx',
  ];

  require.cache[require.resolve(webpackConfig)].exports = config;
}

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

function rewireJest() {
  const paths = require('react-scripts/config/paths');
  const createJestConfig = require('react-scripts/scripts/utils/createJestConfig');
  require.cache[require.resolve('react-scripts/scripts/utils/createJestConfig')].exports = (
    resolve,
    rootDir,
    isEjecting,
  ) => {
    let config = createJestConfig(resolve, rootDir, isEjecting);

    if (!fs.existsSync(paths.testsSetup)) {
      config.setupTestFrameworkScriptFile = path.resolve(__dirname, '../config/jest/setup.js');
    }

    config = {
      ...config,

      transform: {
        '^.+\\.(js|jsx)$': isEjecting
          ? '<rootDir>/node_modules/babel-jest'
          : path.resolve(__dirname, '../config/jest/transforms/babelTransform.js'),
        '^.+\\.tsx?$': path.resolve(__dirname, '../config/jest/transforms/typescriptTransform.js'),
        '^.+\\.css$': resolve('config/jest/cssTransform.js'),
        '^(?!.*\\.(js|jsx|css|json)$)': resolve('config/jest/fileTransform.js'),
      },
      collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
      testMatch: [
        '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/**/*.(spec|test).{js,jsx,ts,tsx}',
      ],
      globals: {
        'ts-jest': {
          tsConfig: locateTsConfig(paths.appPath),
        },
      },
      moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node', 'mjs', 'ts', 'tsx'],
    };

    return config;
  };
}

module.exports = function(prod) {
  rewireEnv();
  rewirePaths();
  rewireWebpack(prod);
  rewireJest();
};
