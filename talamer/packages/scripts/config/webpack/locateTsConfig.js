const path = require('path');
const fs = require('fs');

// Find a test config by walking up the parent directories.
module.exports = function locateTsConfig(pathName) {
  const tsConfigPath = path.resolve(pathName, 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    return tsConfigPath;
  }
  if (pathName === '/') {
    return undefined;
  }
  return locateTsConfig(path.resolve(pathName, '../'));
};
