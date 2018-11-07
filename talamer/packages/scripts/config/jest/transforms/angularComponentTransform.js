const {process} = require('./typescriptTransform');

const TEMPLATE_URL_REGEX = /templateUrl\s*:\s*('|"|`)(\.\/){0,}(.*)('|"|`)/g;
const STYLE_URLS_REGEX = /styleUrls\s*:\s*\[[^\]]*\]/g;

/* eslint-disable no-param-reassign */
module.exports.process = (src, path, config, transformOptions) => {
  src = src
    .replace(TEMPLATE_URL_REGEX, 'template: require($1./$3$4)')
    .replace(STYLE_URLS_REGEX, 'styles: []');
  return process(src, path, config, transformOptions);
};
