/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cloneDeep = require('lodash/cloneDeep');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
// if env is 'inmemory', the inmemory debug resource is used
const FABRIC8_FORGE_API_URL = process.env.FABRIC8_FORGE_API_URL || 'https://forge.api.prod-preview.openshift.io';
const FABRIC8_WIT_API_URL = process.env.FABRIC8_WIT_API_URL || 'https://api.prod-preview.openshift.io/api/';
const FABRIC8_AUTH_API_URL = process.env.FABRIC8_AUTH_API_URL || 'https://auth.prod-preview.openshift.io/api/';
const FABRIC8_REALM = process.env.FABRIC8_REALM || 'fabric8';
const FABRIC8_SSO_API_URL = process.env.FABRIC8_SSO_API_URL || 'https://sso.prod-preview.openshift.io/';
const FABRIC8_RECOMMENDER_API_URL = process.env.FABRIC8_RECOMMENDER_API_URL || 'https://api-bayesian.dev.rdu2c.fabric8.io/api/v1/';
const FABRIC8_FORGE_URL = process.env.FABRIC8_FORGE_URL;
const FABRIC8_PIPELINES_NAMESPACE = process.env.FABRIC8_PIPELINES_NAMESPACE;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const BUILD_NUMBER = process.env.BUILD_NUMBER;
const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
const BUILD_VERSION = process.env.BUILD_VERSION;
const FABRIC8_BRANDING = process.env.FABRIC8_BRANDING || 'fabric8';

const OSO_CORS_PROXY = {
  target: `https://${process.env.KUBERNETES_SERVICE_HOST}:${process.env.KUBERNETES_SERVICE_PORT}`,
  // Remove our prefix from the forwarded path
  pathRewrite: { '^/_p/oso': '' },
  // Disable cert checks for dev only
  secure: false,
  ws: true,
  //changeOrigin: true,
  logLevel: "debug",
    onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
};

const METADATA = webpackMerge(commonConfig({ env: ENV }).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR,
  FABRIC8_FORGE_API_URL: FABRIC8_FORGE_API_URL,
  FABRIC8_WIT_API_URL: FABRIC8_WIT_API_URL,
  FABRIC8_REALM: FABRIC8_REALM,
  FABRIC8_SSO_API_URL: FABRIC8_SSO_API_URL,
  FABRIC8_AUTH_API_URL : FABRIC8_AUTH_API_URL,
  FABRIC8_RECOMMENDER_API_URL: FABRIC8_RECOMMENDER_API_URL,
  FABRIC8_FORGE_URL: FABRIC8_FORGE_URL,
  FABRIC8_PIPELINES_NAMESPACE: FABRIC8_PIPELINES_NAMESPACE,
  PUBLIC_PATH: PUBLIC_PATH,
  BUILD_NUMBER: BUILD_NUMBER,
  BUILD_TIMESTAMP: BUILD_TIMESTAMP,
  BUILD_VERSION: BUILD_VERSION,
  FABRIC8_BRANDING: FABRIC8_BRANDING
});

console.log(helpers.nodeModulePath('fabric8-planner'));

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  console.log('The merged metadata:', METADATA);
  return webpackMerge(commonConfig({ env: ENV }), {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'inline-source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

      /**
       * The output directory as absolute path (required).
       *
       * See: http://webpack.github.io/docs/configuration.html#output-path
       */
      path: helpers.root('dist'),

      publicPath: METADATA.PUBLIC_PATH,

      /**
       * Specifies the name of each output file on disk.
       * IMPORTANT: You must not specify an absolute path here!
       *
       * See: http://webpack.github.io/docs/configuration.html#output-filename
       */
      filename: '[name].bundle.js',

      /**
       * The filename of the SourceMaps for the JavaScript files.
       * They are inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
       */
      sourceMapFilename: '[name].map',

      /** The filename of non-entry chunks as relative path
       * inside the output.path directory.
       *
       * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
       */
      chunkFilename: '[id].chunk.js',

      library: 'ac_[name]',

      libraryTarget: 'var'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            // Example helpers.nodeModulePath("fabric8-planner"),
            // Exclude any problematic sourcemaps
            helpers.nodeModulePath("mydatepicker"),
            helpers.nodeModulePath("ng2-completer"),
            helpers.nodeModulePath("angular2-flash-messages"),
            helpers.nodeModulePath("ngx-dropdown"),
            helpers.nodeModulePath("ngx-modal"),
            helpers.nodeModulePath("ngx-modal"),
            helpers.nodeModulePath("ng2-dnd")
          ],
          use: ["source-map-loader"],
          enforce: "pre"
        }
      ]
    },

    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/config',
          to: '_config',
          transform: function env(content, path) {
            return content.toString('utf-8').replace(/{{ .Env.([a-zA-Z0-9_-]*) }}/g, function(match, p1, offset, string){
              return process.env[p1];
            });
          }
        }
      ]),
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
          'API_URL': JSON.stringify(METADATA.FABRIC8_WIT_API_URL),
          'FABRIC8_FORGE_API_URL': JSON.stringify(METADATA.FABRIC8_FORGE_API_URL),
          'FABRIC8_WIT_API_URL': JSON.stringify(METADATA.FABRIC8_WIT_API_URL),
          'FABRIC8_REALM': JSON.stringify(METADATA.FABRIC8_REALM),
          'FABRIC8_SSO_API_URL': JSON.stringify(METADATA.FABRIC8_SSO_API_URL),
          'FABRIC8_AUTH_API_URL': JSON.stringify(METADATA.FABRIC8_AUTH_API_URL),
          'FABRIC8_RECOMMENDER_API_URL': JSON.stringify(METADATA.FABRIC8_RECOMMENDER_API_URL),
          'FABRIC8_FORGE_URL': JSON.stringify(METADATA.FABRIC8_FORGE_URL),
          'FABRIC8_PIPELINES_NAMESPACE': JSON.stringify(FABRIC8_PIPELINES_NAMESPACE),
          'PUBLIC_PATH': JSON.stringify(METADATA.PUBLIC_PATH),
          'BUILD_NUMBER': JSON.stringify(BUILD_NUMBER),
          'BUILD_TIMESTAMP': JSON.stringify(BUILD_TIMESTAMP),
          'BUILD_VERSION': JSON.stringify(BUILD_VERSION),
          'FABRIC8_BRANDING': JSON.stringify(FABRIC8_BRANDING)
        }
      }),

      /**
       * Plugin: NamedModulesPlugin (experimental)
       * Description: Uses file names as module name.
       *
       * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
       */
      new NamedModulesPlugin(),

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {

          /**
           * Static analysis linter for TypeScript advanced options configuration
           * Description: An extensible linter for the TypeScript language.
           *
           * See: https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          }

        }
      })

    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: {
        disableDotRule: true,
      },
      watchOptions: {
        aggregateTimeout: 2000,
        poll: 1000 //to allow watching in NFS and VirtualBox machines
      },
      proxy: {
        "/_p/oso/api/*": cloneDeep(OSO_CORS_PROXY),
        "/_p/oso/apis/*": cloneDeep(OSO_CORS_PROXY),
        "/_p/oso/oapi/*": cloneDeep(OSO_CORS_PROXY),
        "/_p/oso/swaggerapi/*": cloneDeep(OSO_CORS_PROXY)
      }
    },

    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
};
