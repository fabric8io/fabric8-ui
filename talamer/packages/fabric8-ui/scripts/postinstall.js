const fs = require('fs');
const path = require('path');

function processFile(source, target, pattern) {
  let contents = fs.readFileSync(source).toString();
  contents = contents.replace(pattern, '');
  fs.writeFileSync(target, contents);
}

// TODO Find a more appropriate place to put the altered files.
// We may be able to eliminate this altogether as we move to pf4 and clean up the UI.

// Removes the line importing fonts.less
const pfless = require.resolve('patternfly/dist/less/patternfly.less');
processFile(pfless, path.resolve(pfless, '../patternfly.fontless.less'), /@import "fonts.less";/);

// Removes Open Sans font definitions from patternfly.min.css
const pfcss = require.resolve('patternfly/dist/css/patternfly.min.css');
processFile(
  pfcss,
  path.resolve(pfcss, '../patternfly.fontless.min.css'),
  /@font-face{font-family:"Open Sans".*?}/g,
);
