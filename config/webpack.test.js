/**
 * @author: @AngularClass
 */

const helpers = require('./helpers');
const path = require('path');
const stringify = require('json-stringify');

/**
 * Webpack Plugins
 */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
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
const FABRIC8_JENKINS_API_URL = process.env.FABRIC8_JENKINS_API_URL;
const FABRIC8_BRANDING = 'fabric8';

module.exports = function () {
   return {
    /**
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /**
     * As of Webpack 4 we need to set the mode.
     */
    mode: 'development',

    /**
     * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
     *
     * Do not change, leave as is or it wont work.
     * See: https://github.com/webpack/karma-webpack#source-maps
     */
    // devtool: 'inline-source-map',

    entry: {
      'vendor': './src/vendor.browser.ts',
      'polyfills': './src/polyfills.browser.ts',
      // 'main': aotMode ? './src/main.browser.aot.ts' : './src/main.browser.ts'
      'main': './src/main.browser.ts'
    },

    /**
     * Options affecting the resolving of modules.
     *
     * See: https://webpack.js.org/configuration/resolve
     */
    resolve: {

      // alias: {
      //   "testing": path.resolve(__dirname, "../src/testing")
      // },

      /**
       * An array that automatically resolve certain extensions.
       * Which is what enables users to leave off the extension when importing.
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
      extensions: ['.js', '.ts', '.json']
    },

    // require those dependencies but don't bundle them
    // externals: [/^@angular\//, /^rxjs\//],

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
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular')
            //     helpers.nodeModulePath("mydatepicker"),
            //     helpers.nodeModulePath("ng2-completer"),
            //     helpers.nodeModulePath("angular2-flash-messages"),
            //     helpers.nodeModulePath("ngx-dropdown"),
            //     helpers.nodeModulePath("ngx-modal"),
            //     helpers.nodeModulePath("ngx-modal"),
            //     helpers.nodeModulePath("ng2-dnd")
          ]
        },

        // {
        //   test: /\.ts$/,
        //   enforce: 'pre',
        //   use: [{
        //     loader: 'tslint-loader',
        //     options: {
        //       configFile: "tslint.json",
        //       tsConfigFile: 'tsconfig.json',
        //       formattersDirectory: 'node_modules/tslint-loader/formatters/',
        //       formatter: 'custom',
        //       emitErrors: false,
        //       failOnHint: true,
        //       resourcePath: 'src',
        //       typeCheck: true,
        //     }
        //   }],
        //   exclude: [
        //     helpers.root('node_modules')
        //   ]
        // },

        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig-test.json'
              }
            },
            'angular2-template-loader'
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
          type: "javascript/auto",
          use: ['json-loader']
        },

        /**
         * HTML Linter
         * Checks all files against .htmlhintrc
         */
        {
          enforce: 'pre',
          test: /\.html$/,
          use: {
            loader: 'htmlhint-loader',
            options: {
              configFile: './.htmlhintrc'
            }
          },
          exclude: [/node_modules/]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: ['html-loader']
        },

        /**
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /^(?!.*component).*\.css$/,
          use: [
            'style-loader',
            // isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                context: '/'
              },
            },
          ]
        },
        {
          test: /\.component\.css$/,
          use: [
            'to-string-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: false,
                sourceMap: true,
                context: '/'
              }
            }
          ]
        },

        {
          test: /^(?!.*component).*\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: false,
                sourceMap: true,
                context: '/'
              }
            }, {
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
        }, {
          test: /\.component\.less$/,
          use: [
            'to-string-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: false,
                sourceMap: true,
                context: '/'
              }
            }, {
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

        /**
         * File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.(woff2|woff|ttf|eot|svg)$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 3000,
              includePaths: [
                path.resolve(__dirname, "../node_modules/patternfly/dist/fonts/")
              ],
              name: '_assets/fonts/[name]' + '.[ext]'
            }
          },
          exclude: [
            path.resolve(__dirname, "../src/assets/images/"),
            /OpenSans.*\.(woff2|woff|ttf|eot|svg)$/ // Exclude loading OpenSans fonts as it will come from CDN
          ]
        },
        {
          test: /\.(jpg|png|svg|gif|jpeg)$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 3000,
              includePaths: [
                path.resolve(__dirname, "../src/assets/images/")
              ],
              name: '_assets/images/[name]' + '.[ext]'
            }
          },
          exclude: path.resolve(__dirname, "../node_modules/patternfly/dist/fonts/")
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
          use: {
            loader: 'istanbul-instrumenter-loader',
            options: {
              esModules: true
            }
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
          'FABRIC8_JENKINS_API_URL': stringify(FABRIC8_JENKINS_API_URL),
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
        // /angular(\\|\/)core(\\|\/)@angular/,
        /\@angular(\\|\/)core(\\|\/)fesm5/,
        helpers.root('./src')
      ),
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('src') // location of your src
      ),

      new HtmlWebpackPlugin(),

      // Reference: https://github.com/johnagan/clean-webpack-plugin
      // Removes the bundle folder before the build
      new CleanWebpackPlugin(['bundles'], {
        root: helpers.root(),
        verbose: false,
        dry: false
      }),

      /**
       * StyleLintPlugin
       */
      new StyleLintPlugin({
        configFile: '.stylelintrc',
        syntax: 'less',
        context: 'src',
        files: '**/*.less',
        failOnError: true,
        quiet: false,
      })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      clearImmediate: false,
      crypto: 'empty',
      global: true,
      module: false,
      process: false,
      setImmediate: false
    },

    stats: 'verbose'
  };
};
