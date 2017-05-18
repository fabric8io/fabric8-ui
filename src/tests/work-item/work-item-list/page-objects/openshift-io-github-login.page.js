/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * Fabric8 Start Page Definition
 */

var testSupport = require('../testSupport'),
    constants = require("../constants"),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page');

let until = protractor.ExpectedConditions;
//let CompleteRegistrationPage = require ("./complete-registration.page");
//let Fabric8MainPage = require ("./fabric8-main.page");

class OpenShiftIoGithubLoginPage {

  constructor() {
  };

  get githubLoginField () {
     return element(by.id("login_field"));
  }

  clickGithubLoginField () {
     browser.wait(until.presenceOf(this.githubLoginField), constants.LONG_WAIT, 'Failed to find github loginbutton');
     this.githubLoginField.click().then(function(){
      console.log("OpenShiftIoGithubLoginPage - clicked element:githubLoginField");
    });
    return;
  }

  typeGithubLoginField (usernameString) {
     return this.githubLoginField.sendKeys(usernameString);
  }

  get githubPassword () {
     return element(by.id("password"));
  }

  clickGithubPassword () {
     this.githubPassword.click().then(function(){
      console.log("OpenShiftIoGithubLoginPage - clicked element:githubPassword");
    });
    return;
  }

  typeGithubPassword (passwordString) {
     return this.githubPassword.sendKeys(passwordString);
  }

  get githubLoginButton () {
     return element(by.css(".btn.btn-primary.btn-block"));
  }

  clickGithubLoginButton () {
    browser.wait(until.presenceOf(this.githubLoginButton), constants.WAIT, 'Failed to find github login');
    this.githubLoginButton.click().then(function(){
      console.log("OpenShiftIoGithubLoginPage - clicked element:githubLoginButton");
    });
    return new OpenShiftIoDashboardPage();
//    return new CompleteRegistrationPage();
//    return new Fabric8MainPage();
  }

  get authorizeApplicationButton () {
//    return element (by.id("js-oauth-authorize-btn"));
    return element (by.xpath(".//button[contains(text(), 'Authorize application')]"));
  }
  clickAuthorizeApplicationButton () {
    this.authorizeApplicationButton.click().then(function(){
      console.log("OpenShiftIoGithubLoginPage - clicked element: authorizeApplicationButton");
    });
    return; 
  }

}

module.exports = OpenShiftIoGithubLoginPage;
