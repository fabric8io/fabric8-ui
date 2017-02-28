const helpers = require('./helpers');
const path = require('path');

const modules = [
  {
    name: 'bootstrap'
  }, {
    name: 'font-awesome',
    module: 'font-awesome',
    path: 'font-awesome',
    sass: 'scss'
  }, {
    name: 'patternfly',
    module: 'patternfly-sass-with-css'
  }
];

modules.forEach(val => {
  val.module = val.module || val.name + '-sass';
  val.path = val.path || path.join(val.module, 'assets');
  val.modulePath = val.modulePath || path.join('node_modules', val.path);
  val.sass = val.sass || path.join('stylesheets');
  val.sassPath = path.join(helpers.root(), val.modulePath, val.sass);
});

exports.modules = modules;
