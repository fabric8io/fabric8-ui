const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const argv = process.argv.slice(2);
const appDirectory = fs.realpathSync(process.cwd());
execSync(
  `${path.resolve(__dirname, '../node_modules/.bin/http-server')} ${path.resolve(
    appDirectory,
    argv && argv.length >= 2 ? argv[1] : 'dist',
  )} --cors`,
  { stdio: [0, 1, 2] },
);
