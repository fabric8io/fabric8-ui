/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const path = require('path');
var stringify = require('json-stringify');

/**
 * Webpack Plugins
 */
const webpack = require('webpack');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const FABRIC8_FORGE_API_URL = process.env.FABRIC8_FORGE_API_URL;
const FABRIC8_FEATURE_TOGGLES_API_URL = process.env.FABRIC8_FEATURE_TOGGLES_API_URL;
const FABRIC8_WIT_API_URL = process.env.FABRIC8_WIT_API_URL;
const FABRIC8_REALM = process.env.FABRIC8_REALM || 'fabric8';
const FABRIC8_RECOMMENDER_API_URL = process.env.FABRIC8_RECOMMENDER_API_URL || 'http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/';
const FABRIC8_PIPELINES_NAMESPACE = process.env.FABRIC8_PIPELINES_NAMESPACE || '-development';
const FABRIC8_BRANDING = 'fabric8';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return {

    /**
     * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
     *
     * Do not change, leave as is or it wont work.
     * See: https://github.com/webpack/karma-webpack#source-maps
     */
    //devtool: 'inline-source-map',

    /**
     * Options affecting the resolving of modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.ts', '.js'],

      modules: [helpers.root('src'), helpers.root('node_modules'),
        // Todo: fabric8-stack-analysis-ui/src/app/stack/overview/chart-component.js cannot locate c3
        helpers.root("node_modules/patternfly/node_modules/c3"),
        helpers.root("node_modules/patternfly/node_modules/d3")
      ]
    },

    /**
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      /**
       * An array of automatically applied loaders.
       *
       * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
       * This means they are not resolved relative to the configuration file.
       *
       * See: http://webpack.github.io/docs/configuration.html#module-loaders
       */
      rules: [

        /**
         * Source map loader support for *.js files
         * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
         *
         * See: https://github.com/webpack/source-map-loader
         */
        // {
        //   test: /\.js$/,
        //   use: ['source-map-loader'],
        //   exclude: [
        //     // these packages have problems with their sourcemaps
        //     helpers.nodeModulePath("mydatepicker"),
        //     helpers.nodeModulePath("ng2-completer"),
        //     helpers.nodeModulePath("angular2-flash-messages"),
        //     helpers.nodeModulePath("ngx-dropdown"),
        //     helpers.nodeModulePath("ngx-modal"),
        //     helpers.nodeModulePath("ngx-modal"),
        //     helpers.nodeModulePath("ng2-dnd")
        //   ]
        // },

        /**
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         */
        {
          test: /\.ts$/,
          use: [
            {
              loader: "awesome-typescript-loader",
              options: {
                configFileName: 'tsconfig-test.json'
              }
            },
            {
              loader: "angular2-template-loader"
            }

          ],
          exclude: [/\.e2e\.ts$/]
        },

        /**
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          use: ['json-loader'],
          exclude: [ path.resolve(__dirname, 'src/index.html') ]
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          use: [
            {
              loader: "to-string-loader"
            },
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        },

        {
          test: /\.less$/,
          use: [
            {
              loader: 'to-string-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader',
              options: {
                paths: [
                  path.resolve(__dirname, "../node_modules/patternfly/dist/less"),
                  path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies"),
                  path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies/bootstrap"),
                  path.resolve(__dirname, "../node_modules/patternfly/dist/less/dependencies/font-awesome"),
                ],
                sourceMap: true
              }
            }
          ]
        },

        /* File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          loaders: [
            {
              loader: "url-loader",
              query: {
                limit: 3000,
                name: 'vendor/fonts/[name].[hash].[ext]'
              }
            }
          ]
        }, {
          test: /\.jpg$|\.png$|\.gif$|\.jpeg$/,
          loaders: [
            {
              loader: "url-loader",
              query: {
                limit: 3000,
                name: 'vendor/images/[name].[hash].[ext]'
              }
            }
          ]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [ path.resolve(__dirname, 'src/index.html') ]
        },
        /**
         * Instruments JS files with Istanbul for subsequent code coverage reporting.
         * Instrument only testing sources.
         *
         * See: https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true
          },
          include: helpers.root('src'),
          exclude: [
            /\.(e2e|spec|mock)\.ts$/,
            /node_modules/
          ]
        }
      ]
    },

     /**
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'ENV': stringify(ENV),
        'HMR': false,
        'process.env': {
          'ENV': stringify(ENV),
          'FABRIC8_FORGE_API_URL': stringify(FABRIC8_FORGE_API_URL),
          'FABRIC8_FEATURE_TOGGLES_API_URL': stringify(FABRIC8_FEATURE_TOGGLES_API_URL),
          'FABRIC8_WIT_API_URL': stringify(FABRIC8_WIT_API_URL),
          'FABRIC8_REALM': stringify(FABRIC8_REALM),
          'FABRIC8_RECOMMENDER_API_URL' : stringify(FABRIC8_RECOMMENDER_API_URL),
          'NODE_ENV': stringify(ENV),
          'HMR': false
        }
      }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve(__dirname, 'src') // location of your src
      ),

       /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {

        }
      })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    },

    stats: "verbose"
  };
};
