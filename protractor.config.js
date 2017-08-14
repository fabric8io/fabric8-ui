exports.config = {
    params: {
    baseUrl: {
      osio: 'https://openshift.io/',
      username: 'testuser@redhat.com'
    }
    },
    useAllAngular2AppRoots: true,
    getPageTimeout: 30000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['src/tests/**/*.spec.js'],
    exclude: ['src/tests/**/EE/*.spec.js'],

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
    }
};

