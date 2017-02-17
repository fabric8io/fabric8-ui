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
    new webpack.optimize.CommonsChunkPlugin({
      async: true, // Create shared async bundle between your async routes
      children: true, // Keep vendorish stuff out of shared bundle and in shared async route for when needed
      minChunks: 2 // If used in 2 or more async routes
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['polyfills', 'vendor'], // Run this against both of these entries
      minChunks: function(module) { // Extract all modules from node_modules into vendor chunk
        return /node_modules/.test(module.resource)
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['inline'], // Forces the runtime out of all entries into isolated one
      minChunks: Infinity
    }),
    /* Uncomment below to use Chunks.*/
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   child: true,
    //   children: true,
    //   minChunks: 2
    // }),

    new ngToolsWebpack.AotPlugin({
      "tsConfigPath": "./tsconfig-aot.json",
    }),

    /**
     * Webpack plugin and CLI utility that represents bundle content as convenient interactive zoomable treemap
     */
    new BundleAnalyzerPlugin({
      generateStatsFile: true
    }),

    /* Uncomment below to use Chunks.*/
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['main', 'vendor', 'polyfills']
    // }),

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
  module: {
    loaders: [
      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: '@ngtools/webpack' }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};
