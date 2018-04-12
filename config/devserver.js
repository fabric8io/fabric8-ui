const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const argv = require('yargs').argv

// pull in the dev config
const config = require('./webpack.dev.js')();

// include the webpack dev server entry point to enable reloading
const host_port = `${config.devServer.host}:${config.devServer.port}`;
config.entry.webpackDevServer = `webpack-dev-server/client?http://${host_port}`;

const server = new WebpackDevServer(webpack(config), {
  ...config.devServer,
  publicPath: config.output.publicPath,
  contentBase: path.join(__dirname, '../src/'),
  stats: {
    colors: true
  },
  hot: !!argv.hot
});

// increase the default keepAliveTimeout from 5 seconds
server.keepAliveTimeout = argv.keepAliveTimeout || 10000;

server.listen(config.devServer.port, config.devServer.host, (err) => {
  if (err) {
    console.error(err);
  }

  console.log(`Listening at http://${host_port}`);
});
