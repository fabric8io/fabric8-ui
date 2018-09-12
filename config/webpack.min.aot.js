const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ChunkManifestPlugin = require('chunk-manifest-webpack2-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ngToolsWebpack = require('@ngtools/webpack');
const path = require('path');
const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const WebpackMd5Hash = require('webpack-md5-hash');
const commonConfig = require('./webpack.common.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {
  /**
   * As of Webpack 4 we need to set the mode.
   */
  mode: 'production',

  resolve: {
    extensions: ['.ts', '.js']
  },

   // Uncomment below to use Chunks.
  // entry: {
  //   'polyfills': './src/polyfills.browser.ts',
  //   'vendor': './src/vendor.browser.ts',
  //   'main': './src/main.browser.ts'
  // },
  //  Comment below to use Chunks.
  entry: './src/main.browser.ts',

  output: {
    path: path.join(process.cwd(), 'dist'),
    publicPath: 'dist/',
    filename: './aot/[name].[chunkhash].js',
    chunkFilename: './aot/[id].[chunkhash].js'
  },
  plugins: [
    new ngToolsWebpack.AotPlugin({
      "tsConfigPath": "./tsconfig-aot.json",
    }),

    /**
     * Webpack plugin and CLI utility that represents bundle content as convenient interactive zoomable treemap
     */
    new BundleAnalyzerPlugin({
      generateStatsFile: true
    }),

    /* The following works with Chunks and should be uncommented when Chunks are working, but not needed for Chunks.*/
    // new webpack.NoErrorsPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {screw_ie8: true, keep_fnames: true},
    //   compress: {screw_ie8: true},
    //   comments: false,
    //   compressor: {
    //     warnings: false
    //   }
    // }),
    // new WebpackMd5Hash(),
    // new ManifestPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'ENV': JSON.stringify(ENV)
    //   }
    // })


  ],

  /**
   * Version 4 webpack runs optimizations for you depending on the chosen mode.
   *
   * The following plugins have been removed from Webpack 4 which were extensively used in previous versions.
   *  - NoEmitOnErrorsPlugin
   *  - ModuleConcatenationPlugin
   *  - NamedModulesPlugin
   *  - CommonsChunkPlugin
   *
   * see: https://webpack.js.org/configuration/optimization/
   */
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: { // CommonsChunkPlugin()
      cacheGroups: {
        polyfills: {
          name: 'polyfills',
          minChunks: Infinity
        },
        vendor: {
          name: 'vendor',
          chunks: 'async',
          minChunks: Infinity
        },
        main: {
          name: 'main',
          chunks: 'async',
          minChunks: 2
        },
        manifest: {
          name: 'manifest',
          minChunks: Infinity
        },
      }
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true //ModuleConcatenationPlugin
  },

  module: {
    loaders: [
      { test: /\.less$/, loaders: ['raw-loader', 'less-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: '@ngtools/webpack' }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};
