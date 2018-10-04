process.env.NODE_ENV = 'production';
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const webpackConfigProd = require('../config/webpack/webpack.config.prod');

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html',
  }),
);

require('./build');
