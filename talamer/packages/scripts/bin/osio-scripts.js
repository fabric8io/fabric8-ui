#!/usr/bin/env node

// 'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const supportedScripts = [
  'analyze',
  'build',
  'start',
  'test',
  'test:coverage',
  'test:debug',
  'test:update',
];

const scriptOptions = {
  test: {
    coverage: '--coverage',
    debug: '-i',
    update: '-u',
  },
};

// eslint-disable-next-line node/no-extraneous-require
const spawn = require('react-dev-utils/crossSpawn');

const args = process.argv.slice(2);

const scriptIndex = args.findIndex((x) => supportedScripts.includes(x));
const [script, scriptOption] = (scriptIndex === -1 ? args[0] : args[scriptIndex]).split(':');
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (supportedScripts.includes(script)) {
  const options = (scriptOptions[script] || {})[scriptOption || 'default'] || null;
  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(scriptOption === 'debug' ? '--inspect-brk' : null)
      .concat(require.resolve(`../scripts/${script}`))
      .concat(args.slice(scriptIndex + 1).concat(options))
      .filter((x) => x != null),
    {stdio: 'inherit'},
  );
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.',
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.',
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log(`Unknown script "${script}".`);
  console.log(`Valid scripts are: ${supportedScripts.join(', ')}`);
}
