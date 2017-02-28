const helpers = require('./helpers');
const webpack = require('webpack');
const commonConfig = require('./webpack.common.js');

/**
 * Webpack Plugins
 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpackMerge = require('webpack-merge');

/**
 * Webpack Constants
 */
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const API_URL = process.env.API_URL || 'http://api.almighty.io/api/';
const FORGE_URL = process.env.FORGE_URL;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

const METADATA = webpackMerge(commonConfig.metadata, {
  API_URL: API_URL,
  ENV: ENV,
  FORGE_URL: FORGE_URL,
  PUBLIC_PATH: PUBLIC_PATH
});

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  entry: helpers.root('index.ts'),

  // require those dependencies but don't bundle them
  externals: [
    /^@angular\//,
    /^rxjs\//
  ],

  output: {
    path: helpers.root('dist'),
    publicPath: METADATA.PUBLIC_PATH,
    filename: 'bundles/fabric8-planner.js',
    library: 'fabric8-planner',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  // htmlLoader: {
  //   minimize: false // workaround for ng2
  // },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // FIXME: https://github.com/webpack/webpack/issues/2644
    // new webpack.optimize.DedupePlugin(),
    // FIXME: webpack's --optimize-minimize option is not working
    //new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'API_URL' : JSON.stringify(METADATA.API_URL),
        'FORGE_URL': JSON.stringify(METADATA.FORGE_URL),
        'PUBLIC_PATH' : JSON.stringify(METADATA.PUBLIC_PATH)
      }
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
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

});
