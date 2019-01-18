// See: https://hackernoon.com/how-to-create-library-in-angular-2-and-publish-to-npm-from-scratch-f2b1272d6266
'use strict';

const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const ROLLUP_GLOBALS = require('./rollup.globals');

export const LIB_NAME = 'ngx-widgets';
export const PATH_SRC = 'dist/';
export const PATH_DIST = 'dist/bundles/';

export const config = {
  external: Object.keys(ROLLUP_GLOBALS),
  input: `${PATH_SRC}index.js`,
  output: {
    name: LIB_NAME,
    sourcemap: true,
  },
  plugins: [
    resolve({
      main: true,
      module: true,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
  ],
  onwarn: (warning) => {
    const skipCodes = ['THIS_IS_UNDEFINED', 'MISSING_GLOBAL_NAME'];
    if (skipCodes.indexOf(warning.code) !== -1) return;
    console.error(warning);
  },
};
