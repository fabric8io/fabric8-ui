const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const {CheckerPlugin} = require('awesome-typescript-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const path = require('path');

process.env.SKIP_PREFLIGHT_CHECK = true;

function rewireEnv() {
  // load env before paths because env will clear the module cache for paths
  const getClientEnvironment = require('react-scripts/config/env');

  require.cache[require.resolve('react-scripts/config/env')].exports = (publicUrl) => {
    const env = getClientEnvironment(publicUrl);
    const paths = require('react-scripts/config/paths');

    // Look for a `env.js` script in the app.
    // If present, load all environment variables which will be passed to the webpack DefinePlugin.
    const envScriptPath = path.resolve(paths.appPath, 'env.js');
    if (fs.existsSync(envScriptPath)) {
      const customEnv = require(envScriptPath)();
      Object.keys(customEnv).forEach((key) => {
        env.raw[key] = customEnv[key];
        env.stringified['process.env'][key] = JSON.stringify(customEnv[key]);
      });
    }
    return env;
  };
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

  // Support eslint for ts and tsx files
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

  const reactScriptsCssLoaders = [
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
  ];

  const {oneOf} = config.module.rules[2];
  oneOf.unshift(
    {
      test: /\.(woff2|woff|ttf|eot|svg)$/,
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
        // TODO why is this path needed?
        includePaths: [path.resolve(__dirname, '../../../node_modules/patternfly/dist/fonts/')],
      },
    },
    // add loaders for angular support
    {
      test: /\.html$/,
      use: ['html-loader'],
    },
    {
      test: /\.component\.css$/,
      use: ['to-string-loader', ...reactScriptsCssLoaders],
    },
    {
      test: /\.component\.less$/,
      use: [
        'to-string-loader',
        ...reactScriptsCssLoaders,
        {
          loader: 'less-loader',
          options: {
            // FIXME why doesn't patternfly use ~ for referencing packages in node_modules?
            // This is such a hack....
            paths: [
              path.resolve(__dirname, '../../../node_modules'),
              path.resolve(__dirname, '../../../node_modules/patternfly/dist/less'),
              path.resolve(__dirname, '../../../node_modules/patternfly/dist/less/dependencies'),
              path.resolve(
                __dirname,
                '../../../node_modules/patternfly/dist/less/dependencies/bootstrap',
              ),
              path.resolve(
                __dirname,
                '../../../node_modules/patternfly/dist/less/dependencies/font-awesome',
              ),
            ],
            sourceMap: !prod,
          },
        },
      ],
    },
    {
      test: /^(?!.*component).*\.less$/,
      use: [
        prod ? MiniCssExtractPlugin.loader : 'style-loader',
        ...reactScriptsCssLoaders,
        {
          loader: 'less-loader',
          options: {
            // FIXME why doesn't patternfly use ~ for referencing packages in node_modules?
            // This is such a hack....
            paths: [
              path.resolve(__dirname, '../../../node_modules'),
              path.resolve(__dirname, '../../../node_modules/patternfly/dist/less'),
              path.resolve(__dirname, '../../../node_modules/patternfly/dist/less/dependencies'),
              path.resolve(
                __dirname,
                '../../../node_modules/patternfly/dist/less/dependencies/bootstrap',
              ),
              path.resolve(
                __dirname,
                '../../../node_modules/patternfly/dist/less/dependencies/font-awesome',
              ),
            ],
            sourceMap: !prod,
          },
        },
      ],
    },

    // Typescript support
    {
      test: /\.ts$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
            allowTsInNodeModules: true,
          },
        },
        'angular-router-loader?loader=import',
        'angular2-template-loader',
      ],
      exclude: [/\.(spec|e2e|test)\.ts$/],
    },
    {
      test: /\.tsx$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
      exclude: [/\.(spec|e2e|test)\.tsx$/],
    },
  );

  oneOf[oneOf.length - 1].exclude.push(/\.(ts|tsx)$/);

  config.plugins.push(new CheckerPlugin());
  config.plugins.push(new ProgressBarPlugin());

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

  // Disable to prevent ts-loader with transpileOnly=true to not cause warnings about
  // exported interfaces not found
  config.module.strictExportPresence = false;

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
          : resolve('config/jest/babelTransform.js'),
        '^.+\\.(ts|tsx|html)$': path.resolve(
          __dirname,
          '../config/jest/transforms/typescriptTransform.js',
        ),
        '^.+\\.css$': resolve('config/jest/cssTransform.js'),
        '^(?!.*\\.(js|jsx|css|json|ts|tsx|html)$)': resolve('config/jest/fileTransform.js'),
      },
      collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        'packages/**/src/**/*.{js,jsx,ts,tsx}',
        '!packages/**/src/**/*.d.ts',
      ],
      testMatch: [
        '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/**/*.(spec|test).{js,jsx,ts,tsx}',
      ],
      globals: {
        'ts-jest': {
          tsConfig: locateTsConfig(paths.appPath),
          stringifyContentPathRegex: '\\.html?$',
        },
      },
      moduleFileExtensions: [
        'ts',
        'tsx',
        'web.js',
        'js',
        'json',
        'web.jsx',
        'jsx',
        'node',
        'mjs',
        'html',
      ],

      // TODO remove these once we can declare them in fabric8-ui
      // or fix the need for these mappings altogether
      moduleNameMapper: {
        '^testing/(.*)': '<rootDir>/src/testing/$1',
        '^ngx-bootstrap$': 'ngx-bootstrap/index.js',
      },
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
