'use strict';

require('./jestGlobalMocks');

require('core-js/es7/reflect');
require('zone.js/dist/zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('jest-zone-patch');

require('./serializers/AngularSnapshotSerializer');
// require('./HTMLCommentSerializer');
const { getTestBed } = require('@angular/core/testing');
const { BrowserDynamicTestingModule } = require('@angular/platform-browser-dynamic/testing');
const { platformBrowserDynamicTesting } = require('@angular/platform-browser-dynamic/testing');

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
