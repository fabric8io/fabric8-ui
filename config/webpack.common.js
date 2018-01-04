/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const ngtools = require('@ngtools/webpack');
const branding = require('./branding');
var path = require('path');
var stringify = require('json-stringify');

/*
 * Webpack Plugins
 */
const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
// const ngcWebpack = require('ngc-webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const TsConfigPathsPlugin = require('awesome-typescript-loader');

/*
 * Webpack Constants
 */
// const HMR = helpers.hasProcessFlag('hot');
// const AOT = helpers.hasNpmFlag('aot');
const METADATA = {
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  FABRIC8_BRANDING: process.env.FABRIC8_BRANDING || 'fabric8'
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  const isProd = options.env === 'production';
  const aotMode = false;//options && options.aot !== undefined;
  console.log('The options from the webpack config: ' + stringify(options, null, 2));

  // ExtractTextPlugin
  const extractCSS = new ExtractTextPlugin({
    filename: '_assets/stylesheets/[name].[id]' + ( isProd ? '.[contenthash]' : '' ) + '.css'
  });

  // const entryFile = aotMode ? './src/main.browser.aot.ts' : './src/main.browser.ts';
  // const outPath = aotMode ? 'dist' : 'aot';
  // const devtool = aotMode ? 'source-map' : 'eval-source-map';
  // const srcPath = path.join(__dirname, 'demo', 'src');
  var config = {

    /*
     * Cache generated modules and chunks to improve performance for multiple incremental builds.
     * This is enabled by default in watch mode.
     * You can pass false to disable it.
     *
     * See: http://webpack.github.io/docs/configuration.html#cache
     */
    //cache: false,

    /*
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: https://webpack.js.org/configuration/entry-context/#entry
     */
    entry: {
      'polyfills': './src/polyfills.browser.ts',
      'vendor': './src/vendor.browser.ts',
      // 'main': aotMode ? './src/main.browser.aot.ts' : './src/main.browser.ts'
      'main': './src/main.browser.ts'
    },

    /*
     * Options affecting the resolving of modules.
     *
     * See: https://webpack.js.org/configuration/resolve
     */
    resolve: {

      /**
       * An array that automatically resolve certain extensions.
       * Which is what enables users to leave off the extension when importing.
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
      extensions: ['.ts', '.js', '.json'],

      /**
       * Tell webpack what directories should be searched when resolving modules.
       *
       * We enable this in dev as it allows npm link to work
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-modules
       */
      modules: [helpers.root('src'), helpers.root('node_modules'),
        // Todo: fabric8-stack-analysis-ui/src/app/stack/overview/chart-component.js cannot locate c3
        helpers.root("node_modules/patternfly/node_modules/c3"),
        helpers.root("node_modules/patternfly/node_modules/d3")
      // ],
      //
      // plugins: [
      //   new TsConfigPathsPlugin( {
      //     baseUrl: helpers.root('src'),
      //     configFileName: 'tsconfig.json'
      //   })
      ]
    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [

        /*
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         * Replace templateUrl and stylesUrl with require()
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          use: aotMode ? [
            '@ngtools/webpack'
          ] : [
              '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd,
              'awesome-typescript-loader',
              'angular2-template-loader',
              'angular2-router-loader'
            ],
          // loaders: '@ngtools/webpack',
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /**
         * Static analysis linter for TypeScript advanced options configuration
         * Description: An extensible linter for the TypeScript language.
         *
         * See: https://github.com/wbuchwalter/tslint-loader
         */
        {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          // exclude: [/node_modules/,/src\/a-runtime-console/],
          options: {
          //   configuration: {
          //     rules: {
          //       quotemark: [true, 'double']
          //     }
          //   },
          //
            // can specify a custom config file relative to current directory or with absolute path
            // 'tslint-custom.json'
            configFile: "tslint.json",

            // tslint errors are displayed by default as warnings
            // set emitErrors to true to display them as errors
            emitErrors: true,

            // tslint does not interrupt the compilation by default
            // if you want any file with tslint errors to fail
            // set failOnHint to true
            failOnHint: true,

            // enables type checked rules like 'for-in-array'
            // uses tsconfig.json from current working directory
            typeCheck: true,

            // automatically fix linting errors
            fix: false,

            // can specify a custom tsconfig file relative to current directory or with absolute path
            // to be used with type checked rules
            tsConfigFile: 'tsconfig.json',

            // path to directory containing formatter (optional)
            formattersDirectory: 'node_modules/tslint-loader/formatters/',

            // name of your formatter (optional)
            formatter: 'custom',

            // These options are useful if you want to save output to files
            // for your continuous integration server
            fileOutput: {
              // The directory where each file's report is saved
              dir: './lint/',

              // The extension to use for each report's filename. Defaults to 'txt'
              ext: 'xml',

              // If true, all files are removed from the report directory at the beginning of run
              clean: true,

              // A string to include at the top of every report file.
              // Useful for some report formats.
              header: '<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">',

              // A string to include at the bottom of every report file.
              // Useful for some report formats.
              footer: '</checkstyle>'
            }
          }
        },


        /*
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          use: ['json-loader']
        },

        /* HTML Linter
         * Checks all files against .htmlhintrc
        */
        {
          enforce: 'pre',
          test: /\.html$/,
          loader: 'htmlhint-loader',
          exclude: [/node_modules/,/src\/a-runtime-console/],
          options: {
            configFile: './.htmlhintrc'
          }
        },

        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: ['html-loader']
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /^(?!.*component).*\.css$/,
          use: extractCSS.extract({
            fallback: "style-loader",
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  context: '/'
                },
              },
            ]
          })
        },
        {
          test: /\.component\.css$/,
          use: [
            {
              loader: 'to-string-loader'
            }, {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
                context: '/'
              }
            }
          ],
        },
        {
          test: /^(?!.*component).*\.less$/,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: true,
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
            ],
          })
        }, {
          test: /\.component\.less$/,
          use: [
            {
              loader: 'to-string-loader'
            }, {
              loader: 'css-loader',
              options: {
                minimize: true,
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
          ],
        },

        /**
         * File loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          use: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: '_assets/fonts/[name].' + (isProd ? '[hash]' : '') + '[ext]'
              }
            }
          ]
        },
        {
          test: /\.jpg$|\.png$|\.svg$|\.gif$|\.jpeg$/,
          use: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: '_assets/images/[name].' + (isProd ? '[hash]' : '') + '[ext]'
              }
            }
          ]
        }
      ]
    },

    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      /*
       * Plugin: ForkCheckerPlugin
       * Description: Do type checking in a separate process, so webpack don't need to wait.
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      new CheckerPlugin(),

      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),

      /*
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

      /*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
       /*
       * this needs to be redirected to reside in the _assets/ directory
       */
      new CopyWebpackPlugin([
        {
          from: 'src/meta'
        }
      ]),

      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        title: branding.assets[METADATA.FABRIC8_BRANDING].title.prefix,
        chunksSortMode: 'dependency',
        metadata: METADATA
      }),

      /*
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),

      /*
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({}),

      extractCSS,

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      /*
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
  };

  if (aotMode) {
    config.plugins.push(new ngtools.AotPlugin({
      tsConfigPath: 'tsconfig-aot.json'
      // entryModule: './src/app/app.module#AppModule',
      // genDir: './src/aot'
    }));
  }

  return config;
};
