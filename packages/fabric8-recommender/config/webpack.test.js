/**
 * @author: @AngularClass
 */
const sass = require('./sass');
const helpers = require('./helpers');
const webpack = require('webpack');

/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const API_URL = process.env.API_URL || (ENV === 'inmemory' ? 'app/' : 'http://localhost:8080/api/');
const FABRIC8_WIT_API_URL = process.env.FABRIC8_WIT_API_URL;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

  /**
   * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
   *
   * Do not change, leave as is or it wont work.
   * See: https://github.com/webpack/karma-webpack#source-maps
   */
  devtool: 'inline-source-map',

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

    /**
     * Make sure root is src
     */
    modules: [helpers.root('src'), 'node_modules']
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
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
      {
        test: /\.ts$/,
        use: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.e2e\.ts$/]
      },

      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['file-loader']
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      /*
        * to string and css loader support for *.css files
        * Returns file content as string
        *
        */
      {
        test: /\.css$/,
        loaders: [
          { loader: "to-string-loader" },
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
        ],
      },

      {
        test: /\.scss$/,
        loaders: [
          {
            loader: 'to-string-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader',
            query: {
              includePaths: sass.modules.map(val => {
                return val.sassPath;
              })
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
      }, {
        test: /\.html$/,
        use: ['raw-loader']
      }

      // /**
      //  * Instruments JS files with Istanbul for subsequent code coverage reporting.
      //  * Instrument only testing sources.
      //  *
      //  * See: https://github.com/deepsweet/istanbul-instrumenter-loader
      //  */
      // {
      //   enforce: 'post',
      //   test: /\.(js|ts)$/,
      //   loader: 'istanbul-instrumenter-loader',
      //   query: {
      //     esModules: true
      //   },
      //   include: helpers.root('src'),
      //   exclude: [
      //     /\.(e2e|spec)\.ts$/,
      //     /node_modules/
      //   ]
      // }
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
      'ENV': JSON.stringify(ENV),
      'HMR': false,
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'API_URL': JSON.stringify(API_URL),
        'NODE_ENV': JSON.stringify(ENV),
        'HMR': false,
      }
    }),

    /**
     * Plugin: ContextReplacementPlugin
     * Description: Provides context to Angular's use of System.import
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
     * See: https://github.com/angular/angular/issues/11580
     */
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('src') // location of your src
    ),

    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
      debug: false,
      options: {
        // legacy options go here
      }
    }),
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
  }
};

