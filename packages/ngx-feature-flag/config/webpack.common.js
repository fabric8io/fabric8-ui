/**
 * Adapted from angular2-webpack-starter
 */
const path = require('path'),
  helpers = require('./helpers'),
  webpack = require('webpack'),
  CleanWebpackPlugin = require('clean-webpack-plugin');
// const stringify = require('json-stringify');

/**
 * Webpack Plugins
 */
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

// ExtractTextPlugin
const extractCSS = new ExtractTextPlugin({
  filename: '[name].[id].css',
  allChunks: true
});

module.exports = {
  devtool: 'inline-source-map',

  node: {
    fs: "empty"
  },

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  entry: helpers.root('index.ts'),

  // require those dependencies but don't bundle them
  externals: [/^@angular\//, /^rxjs\//],

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: [helpers.root('node_modules')]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              declaration: false
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.spec\.ts$/]
      },{
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: "style-loader",
          use: "css-loader?sourceMap&context=/"
        })
      }, {
        test: /\.less$/,
        loaders: [
          {
            loader: 'to-string-loader'
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              context: '/'
            }
          }, {
            loader: 'less-loader',
            options: {
              paths: [
                path.resolve(__dirname, "../node_modules/patternfly/dist/less"),
                path.resolve(__dirname, "../node_modules/patternfly/node_modules")
              ],
              sourceMap: true
            }
          }
        ]
      },

      /* File loader for supporting fonts, for example, in CSS files.
       */
      {
        test: /\.jpg$|\.png$|\.gif$|\.jpeg$|\.svg$/,
        loaders: [
          {
            loader: "url-loader",
            query: {
              limit: 30000000,
              name: 'assets/images/[name].[ext]'
            }
          }
        ]
      },

      // Support for *.json files.
      {
        test: /\.json$/,
        use: ['json-loader']
      },

      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },

  plugins: [
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
      helpers.root('./src')
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
    }),

    new HtmlWebpackPlugin(),

    /**
     * Plugin: ExtractTextPlugin
     * Description: Extracts imported CSS files into external stylesheet
     *
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    // new ExtractTextPlugin('[name].[contenthash].css'),
    new ExtractTextPlugin('[name].css'),

    new webpack.LoaderOptionsPlugin({
      options: {
        tslintLoader: {
          emitErrors: false,
          failOnHint: false
        }
      }
    }),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Reference: https://github.com/johnagan/clean-webpack-plugin
    // Removes the bundle folder before the build
    new CleanWebpackPlugin(['bundles'], {
      root: helpers.root(),
      verbose: false,
      dry: false
    }),
    extractCSS
  ]
};
