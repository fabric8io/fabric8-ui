import { SpecReporter } from 'jasmine-spec-reporter';
import { browser, Config } from 'protractor';

// Workaround to get global var in typescript
const globalAny: any = global;
const token: string = '';

// Validate test config.
function validate_config() {
  // Mysteriously, NODE_ENV is set to "test". NODE_ENV should not have been set to "test"
  // Unset NODE_ENV variable.
  process.env.NODE_ENV = '';
  process.env.SPACE_NAME || new Error('SPACE_NAME variable not set');
  process.env.SPACE_NAME_SCRUM || new Error('SPACE_NAME_SCRUM variable not set');
  process.env.USER_NAME || new Error('USER_NAME variable not set');
  process.env.USER_FULLNAME || new Error('USER_FULLNAME variable not set');
  process.env.AUTH_TOKEN || new Error('TOKEN (Auth token) variable not set');
  process.env.REFRESH_TOKEN || new Error('OFFLINE_TOKEN (Refresh token) variable not set');
}

// Full protractor configuration file reference could be found here:
// https://github.com/angular/protractor/blob/master/lib/config.ts
let conf: Config = {
  framework: 'jasmine2',

  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    isVerbose: true,
    defaultTimeoutInterval: 3 * 60 * 1000, // 3 mins for spec to run
  },

  directConnect: process.env.DIRECT_CONNECTION === 'true',
  useAllAngular2AppRoots: true,
  getPageTimeout: 3 * 60 * 1000, // must load within 3 min
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Ref: https://github.com/angular/protractor/tree/master/exampleTypescript/asyncAwait
  SELENIUM_PROMISE_MANAGER: false,

  specs: ['specs/smoke/smokeTest.spec.js', 'specs/*.js'],
  suites: {
    smokeTest: ['specs/smoke/smokeTest.spec.js'],
    quickPreviewTest: ['specs/**/quickPreview.spec.js'],
    workItemTableTest: ['specs/**/workItemTableTest.spec.js'],
    fullTest: ['specs/**/*.spec.js'],
  },

  //launch chrome instance
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args:
        process.env.HEADLESS_MODE === 'true' ? ['--no-sandbox', '--headless'] : ['--no-sandbox'],
    },
    name: 'browserAgile',
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    validate_config();
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
          displayDuration: true,
        },
        summary: {
          displayDuration: true,
        },
      }),
    );
    // Disable control flow
    browser.ignoreSynchronization = true;
    browser.baseUrl =
      browser.baseUrl + '/' + process.env.USER_NAME + '/' + process.env.SPACE_NAME_SCRUM + '/plan';
    browser.token = encodeURIComponent(
      JSON.stringify({
        access_token: process.env.AUTH_TOKEN,
        expires_in: 1800,
        refresh_token: process.env.REFRESH_TOKEN,
        token_type: 'bearer',
      }),
    );
  },
};

exports.config = conf;
