const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');
const sass = require('./sass');

const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ngcWebpack = require('ngc-webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const sassLintPlugin = require('sasslint-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const precss = require('precss');

// ExtractTextPlugin
const extractCSS = new ExtractTextPlugin({
  filename: '[name].[id]' + (helpers.isProd ? '.[contenthash]' : '') + '.css',
  allChunks: true
}
);


/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const AOT = helpers.hasNpmFlag('aot');
const METADATA = {
  title: 'Fabric8 Planner',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

module.exports = {

  resolve: {
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('src'), helpers.root('node_modules')],
  },

  stats: {
    colors: true,
    reasons: true
  },

  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.ts$/,
      //   use: 'tslint-loader',
      //   exclude: [helpers.root('node_modules')]
      // },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: "style-loader",
          use: "css-loader?sourceMap&context=/"
        })
      },
      {
        test: /^(?!.*component).*\.scss$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: helpers.isProd,
                sourceMap: true,
                context: '/'
              }
            }, {
              loader: 'sass-loader',
              options: {
                includePaths: sass.modules.map(function (val) {
                  return val.sassPath;
                }),
                sourceMap: true
              }
            }
          ],
        })
      }, {
        test: /\.component\.scss$/,
        use: [
          {
            loader: 'to-string-loader'
          }, {
            loader: 'css-loader',
            options: {
              minimize: helpers.isProd,
              sourceMap: true,
              context: '/'
            }
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: sass.modules.map(function (val) {
                return val.sassPath;
              }),
              sourceMap: true
            }
          }
        ],
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
              name: 'assets/fonts/[name].' + (helpers.isProd ? '[hash]' : '') + '[ext]'
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
              name: 'assets/fonts/[name].' + (helpers.isProd ? '[hash]' : '') + '[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      }
    ]
  },

  plugins: [
    new AssetsPlugin({
      path: helpers.root('dist'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),

    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new CheckerPlugin(),


    // new sassLintPlugin({
    //   configFile: '.sass-lint.yml',
    //   context: ['inherits from webpack'],
    //   ignoreFiles: [],
    //   ignorePlugins: [],
    //   glob: '**/*.s?(a|c)ss',
    //   quiet: false,
    //   failOnWarning: false,
    //   failOnError: false,
    //   testing: false
    // }),
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
     * Webpack plugin to optimize a JavaScript file for faster initial load
     * by wrapping eagerly-invoked functions.
     *
     * See: https://github.com/vigneshshanmugam/optimize-js-plugin
     */

    new OptimizeJsPlugin({
      sourceMap: false
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: METADATA.title,
      chunksSortMode: 'dependency',
      metadata: METADATA,
      inject: 'head'
    }),

    /**
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      }
    ]),

    /*
     * Plugin: HtmlElementsPlugin
     * Description: Generate html tags based on javascript maps.
     *
     * If a publicPath is set in the webpack output configuration, it will be automatically added to
     * href attributes, you can disable that by adding a "=href": false property.
     * You can also enable it to other attribute by settings "=attName": true.
     *
     * The configuration supplied is map between a location (key) and an element definition object (value)
     * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
     *
     * Example:
     *  Adding this plugin configuration
     *  new HtmlElementsPlugin({
     *    headTags: { ... }
     *  })
     *
     *  Means we can use it in the template like this:
     *  <%= webpackConfig.htmlElements.headTags %>
     *
     * Dependencies: HtmlWebpackPlugin
     */
    new HtmlElementsPlugin({
      headTags: require('./head-config.common')
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

    /**
     * Plugin: ExtractTextPlugin
     * Description: Extracts imported CSS files into external stylesheet
     *
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    // new ExtractTextPlugin('[name].[contenthash].css'),
    // new ExtractTextPlugin('[name].css'),

    new webpack.LoaderOptionsPlugin({
      // debug: true,
      // options: {
      //   /**
      //    * Html loader advanced options
      //    *
      //    * See: https://github.com/webpack/html-loader#advanced-options
      //    */
      //   // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
      //   htmlLoader: {
      //     minimize: true,
      //     removeAttributeQuotes: false,
      //     caseSensitive: true,
      //     customAttrSurround: [
      //       [/#/, /(?:)/],
      //       [/\*/, /(?:)/],
      //       [/\[?\(?/, /(?:)/]
      //     ],
      //     customAttrAssign: [/\)?\]?=/]
      //   },
      //
      //   context: helpers.root(),
      //   // output: {
      //   //   path: helpers.root('dist')
      //   // },
      //   tslintLoader: {
      //     emitErrors: false,
      //     failOnHint: false,
      //     resourcePath: 'src'
      //   },
      //   /**
      //    * Sass
      //    * Reference: https://github.com/jtangelder/sass-loader
      //    * Transforms .scss files to .css
      //    */
      //   sassLoader: {
      //     //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
      //   }
      // }
    }),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoEmitOnErrorsPlugin(),

    // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // // Dedupe modules in the output
    // new webpack.optimize.DedupePlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    // new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),

    // Copy assets from the public folder
    // Reference: https://github.com/kevlened/copy-webpack-plugin
    // new CopyWebpackPlugin([{
    //   from: helpers.root('src/public')
    // }]),

    // Reference: https://github.com/johnagan/clean-webpack-plugin
    // Removes the bundle folder before the build
    new CleanWebpackPlugin(['bundles'], {
      root: helpers.root(),
      verbose: false,
      dry: false
    }),

    // Fix Angular 2
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)async/,
      helpers.root('node_modules/@angular/core/src/facade/async.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)collection/,
      helpers.root('node_modules/@angular/core/src/facade/collection.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)errors/,
      helpers.root('node_modules/@angular/core/src/facade/errors.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)lang/,
      helpers.root('node_modules/@angular/core/src/facade/lang.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)math/,
      helpers.root('node_modules/@angular/core/src/facade/math.js')
    ),
    extractCSS,

    // new ngcWebpack.NgcWebpackPlugin({
    //   disabled: !AOT,
    //   tsConfig: helpers.root('tsconfig.webpack.json'),
    //   resourceOverride: helpers.root('config/resource-override.js')
    // })

  ]
};
