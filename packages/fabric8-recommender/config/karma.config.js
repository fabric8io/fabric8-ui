var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: './src/assets/img/*', watched: false, included: false, served: true},
      {pattern: './config/karma-test-shim.js', watched: false},
    ],

    proxies: {
      "/assets/img/": "/base/src/assets/img/"
    },

    preprocessors: {
      './config/karma-test-shim.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    coverageReporter: {
	      dir : 'coverage/',
	      reporters: [
		          { type: 'text-summary' },
		          { type: 'json' },
		          { type: 'html' }
		        ]
	  },
    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    // Possible values - 'progress'
    reporters: ['kjhtml', 'coverage', 'mocha'],
    port: 9876,
    colors: !process.env.CI,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'alm-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered
      // (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },
    singleRun: true
  };

  config.set(_config);
};
