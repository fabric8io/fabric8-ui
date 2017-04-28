/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * openshift.io Start Page Definition
 */

var testSupport = require('../testSupport'),
    constants = require("../constants"),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page');

var until = protractor.ExpectedConditions;

class OpenShiftIoRHDLoginPage {

  constructor() {
  };

  /* Social media login buttons */

  get githubLoginButton () {
     return element(by.css("#social-github"));
  }
  clickGithubLoginButton () {
    browser.wait(until.presenceOf(this.githubLoginButton), constants.WAIT, 'Failed to find github login');
    this.githubLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:githubLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get stackoverflowLoginButton () {
     return element(by.css("#social-stackoverflow"));
  }
  clickStackoverflowLoginButton () {
    browser.wait(until.presenceOf(this.stackoverflowLoginButton), constants.WAIT, 'Failed to find stackoverflow login');
    this.stackoverflowLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:stackoverflowLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get linkedinLoginButton () {
     return element(by.css(".fa.fa-linkedin-square"));
  }
  clickLinkedinLoginButton () {
    browser.wait(until.presenceOf(this.linkedinLoginButton), constants.WAIT, 'Failed to find linked in login');
    this.linkedinLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:linkedinLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get twitterLoginButton () {
     return element(by.css("#social-twitter"));
  }
  clickTwitterLoginButton () {
    browser.wait(until.presenceOf(this.twitterLoginButton), constants.WAIT, 'Failed to find twitter login');
    this.twitterLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:twitterLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get facebookLoginButton () {
     return element(by.css("#social-facebook"));
  }
  clickFacebookLoginButton () {
    browser.wait(until.presenceOf(this.facebookLoginButton), constants.WAIT, 'Failed to find facebook login');
    this.facebookLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:facebookLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get googleLoginButton () {
     return element(by.css("#social-google"));
  }
  clickGoogleLoginButton () {
    browser.wait(until.presenceOf(this.googleLoginButton), constants.WAIT, 'Failed to find google login');
    this.googleLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:googleLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get microsoftLoginButton () {
     return element(by.css("#social-microsoft"));
  }
  clickMicrosoftLoginButton () {
    browser.wait(until.presenceOf(this.microsoftLoginButton), constants.WAIT, 'Failed to find microsoft login');
    this.microsoftLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:microsoftLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  get jbossdeveloperLoginButton () {
     return element(by.css("#social-jbossdeveloper"));
  }
  clickJbossdeveloperLoginButton () {
    browser.wait(until.presenceOf(this.jbossdeveloperLoginButton), constants.WAIT, 'Failed to find jbossdeveloper login');
    this.jbossdeveloperLoginButton.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:jbossdeveloperLoginButton");
    });
    return new OpenShiftIoGithubLoginPage();
  }

  /* Red Hat Developer Login */

  get rhdUsernameField () {
     return element(by.css(".login-username-field.field"));
  }
  clickRhdUsernameField () {
     return this.rhdUsernameField.click().then(function(){
      console.log("OpenShiftIoRHDLoginPage - clicked element:rhdUsernameField");
    });
    return;
  }
  typeRhdUsernameField (usernameString) {
     return this.rhdUsernameField.sendKeys(usernameString);
  }

}

module.exports = OpenShiftIoRHDLoginPage;
