/**
 * @author: @AngularClass
 */

const webpack = require('webpack');
const helpers = require('./helpers');
const ngtools = require('@ngtools/webpack');
var path = require('path');

/*
 * Webpack Plugins
 */
const AssetsPlugin = require('assets-webpack-plugin');
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
const ngcWebpack = require('ngc-webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const sassModules = [
  {
    name: 'bootstrap'
  }, {
    name: 'font-awesome',
    module: 'font-awesome',
    path: 'font-awesome',
    sass: 'scss'
  }, {
    name: 'patternfly'
  }
];

sassModules.forEach(val => {
  val.module = val.module || val.name + '-sass';
  val.path = val.path || path.join(val.module, 'assets');
  val.modulePath = val.modulePath || path.join('node_modules', val.path);
  val.sass = val.sass || path.join('stylesheets');
  val.sassPath = path.join(helpers.root(), val.modulePath, val.sass);
});



/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const AOT = helpers.hasNpmFlag('aot');
const METADATA = {
  title: 'Fabric8',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  const isProd = options.env === 'production';
  const aotMode = false;//options && options.aot !== undefined;
  console.log('The options from the webpack config: ' + JSON.stringify(options, null, 2));
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
       * See: https://webpack.js.org/configuration/resolve/#resolve-modules
       */
      // modules: [ path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')]

    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      loaders: [

        /*
         * Typescript loader support for .ts and Angular 2 async routes via .async.ts
         * Replace templateUrl and stylesUrl with require()
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader
         * See: https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          loaders: aotMode ? [
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

        /*
         * Json loader support for *.json files.
         *
         * See: https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader'
        },

        /* Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [path.resolve(__dirname, 'src/index.html')]
        },

        /*
         * to string and css loader support for *.css files
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          loaders: [
            {
              loader: "to-string-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        },

        {
          test: /\.scss$/,
          loaders: [
            {
              loader: 'to-string-loader'
            },
            {
              loader: 'css-loader',
              query: {
                minimize: isProd
              }
            },
            {
              loader: 'sass-loader',
              query: {
                includePaths: sassModules.map(val => {
                  return val.sassPath;
                })
              }
            }
          ]
        },

        /**
         * Fil e loader for supporting fonts, for example, in CSS files.
         */
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          loaders: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: path.resolve(__dirname, 'assets/fonts/[name].') + (isProd ? '[hash]' : '') + '[ext]'
              }
            }
          ]
        },
        {
          test: /\.jpg$|\.png$|\.gif$|\.jpeg$/,
          loaders: [
            {
              loader: 'url-loader',
              query: {
                limit: 3000,
                name: path.resolve(__dirname, 'assets/images/[name].') + (isProd ? '[hash]' : '') + '[ext]'
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
       * Plugin: AssetsPlugin
       * Description: Webpack plugin that emits a json file with assets paths.
       * When working with Webpack you might want to generate your bundles with a generated hash in them (for cache busting).
       * This plug-in outputs a json file with the paths of the generated assets so you can find them from somewhere else.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/kossnocorp/assets-webpack-plugin
       */
      new AssetsPlugin({
        path: path.resolve(__dirname, 'dist'),
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
        template: 'src/index.html',
        title: METADATA.title,
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
      new LoaderOptionsPlugin({})

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
      tsConfigPath: 'tsconfig-aot.json',
      // entryModule: './src/app/app.module#AppModule',
      // genDir: './src/aot'
    }));
  }

  return config;
};
