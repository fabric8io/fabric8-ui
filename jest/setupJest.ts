
'use strict';

require('./jestGlobalMocks');

(function() {
  const jasmineCore = require('jasmine-core');

  const jasmine = jasmineCore.core(jasmineCore);

  const env = jasmine.getEnv({suppressLoadErrors: true});

  jasmineCore.interface(jasmine, env);

  global['jasmine'] = jasmine;
})();

require('core-js/es6/reflect');
require('core-js/es7/reflect');
require('zone.js/dist/zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('jest-zone-patch');
const AngularSnapshotSerializer = require('./serializers/AngularSnapshotSerializer');
// const HTMLCommentSerializer = require('./HTMLCommentSerializer');
const getTestBed = require('@angular/core/testing').getTestBed;
const BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
const platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
