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
  oneOf.unshift(
    // add loaders for angular support
    {
      test: /\.html$/,
      loader: 'raw-loader',
    },
    {
      test: /\.component\.css$/,
      use: [
        'to-string-loader',
        {
          loader: 'css-loader',
          options: {
            minimize: true,
            sourceMap: !prod,
            context: '/',
          },
        },

        // copied from react-scripts/config/webpack.config.dev.js
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              // eslint-disable-next-line node/no-extraneous-require
              require('postcss-flexbugs-fixes'),
              // eslint-disable-next-line node/no-extraneous-require
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
          },
        },
      ],
    },
    {
      test: /\.component\.ts$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
        'angular2-template-loader',
        'angular2-router-loader',
      ],
    },

    // default tsx? loader
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
    },
  );

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
