import 'core-js/es6';
import 'reflect-metadata';

require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development
  Error.stackTraceLimit = Infinity;
  // eslint-disable-next-line global-require
  require('zone.js/dist/long-stack-trace-zone');
}
