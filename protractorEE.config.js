var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html',
  reportOnlyFailedSpecs: false,
  captureOnlyFailedSpecs: true
});

exports.config = {
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['src/tests/**/EE/*poc*.spec.js'],
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    },

    troubleshoot: true,

    capabilities: {
      'browserName': 'chrome',
      'maxInstances': 2,
      'shardTestFiles': true,
      'loggingPrefs': {
      'driver': 'WARNING',
      'server': 'WARNING',
      'browser': 'INFO'
      },
      'chromeOptions': {
      'args': [ '--no-sandbox', '--window-workspace=1']
      }
    },

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }

};
