const fs = require('fs');
const path = require('path');
const { dest, src, series } = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const readlineSync = require('readline-sync');
const { execSync } = require('child_process');

const E2E_PROJECT_NAME = 'fabric8-test';
const E2E_REPO = 'https://github.com/fabric8io/fabric8-test.git';

const E2E_PROJECT = path.resolve(__dirname, '../../../../', E2E_PROJECT_NAME);
const TEST_DIR = path.resolve(E2E_PROJECT, 'ee_tests');

const CONFIG_DIR = path.resolve(TEST_DIR, 'config');
const CONFIG_NAME = 'local_osio.conf.sh';
const CONFIG = path.resolve(CONFIG_DIR, CONFIG_NAME);
const CONFIG_TEMPLATE_NAME = 'local_osio.conf.sh.template';
const CONFIG_TEMPLATE = path.resolve(CONFIG_DIR, CONFIG_TEMPLATE_NAME);

// TODO read protractor.config.ts to identify test keys instead of hard coding
const testSuites = ['all', 'che', 'local', 'logintest', 'planner', 'smoketest'];
const testUrls = {
  'enter custom': null,
  dev: 'http://localhost:3000',
  'local prod': 'http://localhost:8080',
  production: 'http://openshift.io',
  'prod-preview': 'http://prod-preview.openshift.io',
};

// only beta and released levels are supported
const featureLevels = ['beta', 'released'];

function e2eClean() {
  if (fs.existsSync(E2E_PROJECT)) {
    console.log(`Deleting project ${E2E_PROJECT}`);
    return src(E2E_PROJECT, { read: false }).pipe(clean({ force: true }));
  }
  return Promise.resolve();
}

// fetch and update e2e tests
async function e2eFetch() {
  if (fs.existsSync(E2E_PROJECT)) {
    const packageLock = path.resolve(TEST_DIR, 'package-lock.json');
    execSync('git checkout master', { stdio: 'inherit', cwd: E2E_PROJECT });
    execSync(`git checkout HEAD -- ${packageLock}`, { stdio: 'inherit', cwd: E2E_PROJECT });
    execSync(`git pull origin master`, { stdio: 'inherit', cwd: E2E_PROJECT });
  } else {
    execSync(`git clone ${E2E_REPO}`, { stdio: 'inherit', cwd: path.resolve(E2E_PROJECT, '../') });
  }
}

async function e2eInstall() {
  execSync('npm install', { stdio: 'inherit', cwd: TEST_DIR });
}

function e2eEnsureConfigFile() {
  if (!fs.existsSync(CONFIG)) {
    // copy the template to the local config location
    return src(CONFIG_TEMPLATE)
      .pipe(rename(CONFIG_NAME))
      .pipe(dest(CONFIG_DIR));
  }
  return Promise.resolve();
}

function promptTestSuite() {
  return testSuites[
    readlineSync.keyInSelect(testSuites, 'Select a test suite: ', { cancel: false })
  ];
}

function promptOsioUrl(currentValue) {
  let cancel = false;
  // add the current URL as a choice in case it's custom
  if (currentValue.length > 0) {
    cancel = `use current URL (${currentValue})`;
  }

  // create the array of url choices
  const urls = Object.keys(testUrls).map(
    (name) => `${name}${testUrls[name] ? ` (${testUrls[name]})` : ''}`,
  );
  const choice = readlineSync.keyInSelect(urls, 'Select a test URL: ', { cancel });

  // if custom, ask for input
  if (choice === 0) {
    return readlineSync.question(`Enter a custom test URL: `);
  } else if (choice !== -1) {
    return testUrls[Object.keys(testUrls)[choice]];
  }
  return currentValue;
}

function promptInput(field) {
  return readlineSync.question(`Enter value for ${field}: `, {
    hideEchoBack: field.toLowerCase().indexOf('password') !== -1,
  });
}

function promptResetEnvironment() {
  return readlineSync.keyInYN(
    `Reset environment after tests (WARNING: this is desctructive to your account. If unsure choose NO): `,
  );
}

function promptFeatureLevel() {
  return featureLevels[
    readlineSync.keyInSelect(featureLevels, 'Select your OSIO account feature level: ', {
      cancel: false,
    })
  ];
}

function e2eEditConfig() {
  // read the existing config and
  return src(CONFIG)
    .pipe(
      replace(/^(\s*?[^#]*?)\${([a-zA-Z-_]+):-(.*?)}/gm, (match, p1, p2, p3) => {
        let value = null;
        switch (p2) {
          case 'TEST_SUITE':
            value = promptTestSuite();
            break;
          case 'RESET_ENVIRONMENT':
            value = promptResetEnvironment();
            break;
          case 'OSIO_URL':
            value = promptOsioUrl(p3);
            break;
          case 'FEATURE_LEVEL':
            value = promptFeatureLevel();
            break;
          default:
            if (p3 === '') {
              value = promptInput(p2);
            }
        }
        return `${p1}\${${p2}:-${value == null ? p3 : value}}`;
      }),
    )
    .pipe(dest(CONFIG_DIR));
}

function e2eClearConfig() {
  return src(CONFIG, { read: false, allowEmpty: true }).pipe(clean({ force: true }));
}

async function e2eStart() {
  try {
    execSync('npm start', { stdio: 'inherit', cwd: TEST_DIR });
  } catch (err) {
    // suppress as the test would have already logged to console
  }
}

const e2eConfig = series(e2eEnsureConfigFile, e2eEditConfig);
const e2eReconfig = series(e2eClearConfig, e2eConfig);
const e2e = series(e2eFetch, e2eInstall, e2eConfig, e2eStart);

module.exports = {
  e2e,
  e2eClean,
  e2eReconfig,
  e2eStart,
};
