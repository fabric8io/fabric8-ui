/*
 * This script copies contents of dist directory to the root directory. Thus, allowing module imports like so:
 *
 * import { DropDownModule } from 'ngx-widgets/dropdown';
 *
 * Note: In order to support semantic-release, 'npm publish' must be run from the root instead of the dist directory.
 * When publishing a sub folder, npm loses the ability to insert the correct gitHead information, which prevents
 * semantic-release from working properly.
 *
 * See: https://github.com/npm/read-package-json/issues/66
 */
const fs = require('fs');
const path = require('path');

const appPath = './dist/app';
const bundlePath = './dist/bundles';
const bundleTargetPath = './bundles';

function copyFile(source, target) {
  let targetFile = target;

  // If target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursive(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (fs.lstatSync(source).isDirectory() && !fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursive(curSource, targetFolder);
      } else {
        copyFile(curSource, targetFolder);
      }
    });
  } else {
    copyFile(source, targetFolder);
  }
}

function deleteFolderRecursive(source) {
  if (fs.existsSync(source)) {
    fs.readdirSync(source).forEach((file) => {
      const curPath = `${source}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(source);
  }
}

// Skip install for repo clone
if (fs.existsSync('./deploy_key.enc')) {
  process.exit(0);
}

// Copy directories to root so ngx-widgets modules can be imported like so:
//
// import { DropDownModule } from 'ngx-widgets/dropdown';
//
fs.readdir(appPath, (err, items) => {
  for (let i = 0; i < items.length; i++) {
    copyFolderRecursive(`${appPath}/${items[i]}`, '.');
  }
  deleteFolderRecursive(appPath);
});

fs.readdir(bundlePath, (err, items) => {
  if (!fs.existsSync(bundleTargetPath)) {
    fs.mkdirSync(bundleTargetPath);
  }
  for (let i = 0; i < items.length; i++) {
    copyFolderRecursive(`${bundlePath}/${items[i]}`, bundleTargetPath);
  }
  deleteFolderRecursive(bundlePath);
});
