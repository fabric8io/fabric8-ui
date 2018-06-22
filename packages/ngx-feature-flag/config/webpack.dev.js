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

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
// if env is 'inmemory', the inmemory debug resource is used
const API_URL = process.env.API_URL || (ENV==='inmemory'?'app/':'http://localhost:8080/api/');
const STACK_API_URL = process.env.STACK_API_URL || 'http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/';
const FORGE_URL = process.env.FORGE_URL || 'http://localhost:8080/forge';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const OSIO_AUTH_TOKEN = process.env.OSIO_AUTH_TOKEN || '';


const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR,
  API_URL: API_URL,
  STACK_API_URL: STACK_API_URL,
  FORGE_URL: FORGE_URL,
  PUBLIC_PATH: PUBLIC_PATH,
  OSIO_AUTH_TOKEN: OSIO_AUTH_TOKEN
});

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {

    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'cheap-module-source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {
      path: helpers.root('dist'),
      publicPath: '/',
      filename: 'bundles/ngx-feature-flag.js',
      library: 'ngx-feature-flag',
      libraryTarget: 'umd',
      umdNamedDefine: true
    }
  });
};
