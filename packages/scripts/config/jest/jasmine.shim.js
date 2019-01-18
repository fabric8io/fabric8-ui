const jasmineCore = require('jasmine-core');

const jasmine = jasmineCore.core(jasmineCore);

const env = jasmine.getEnv({ suppressLoadErrors: true });

jasmineCore.interface(jasmine, env);

global.jasmine = jasmine;
