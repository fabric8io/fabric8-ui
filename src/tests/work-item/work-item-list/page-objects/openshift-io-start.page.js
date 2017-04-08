/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * openshidt.io Start Page Object Model Definition
 */

var OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    testSupport = require('../testSupport'),
    constants = require("../constants");

var until = protractor.ExpectedConditions;

class OpenShiftIoStartPage {

  constructor() {
    browser.get("https://prod-preview.openshift.io/");
  };

  /* Navigation panel UI objects */

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
     return this.navBar.click();
  }

  /* OpenShift.io image */
  get openShiftIoImage () {
     return element(by.css(".navbar-brand>img"));
  }
  clickOpenShiftIoImage () {
     return this.openShiftIoImage.click();
  }

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
     return this.navBar.click();
  }

  /* Navigation bar toggle (non-desktop mode only) */
  get navBarToggle () {
     return element(by.css(".navbar-toggle"));
  }
  clickNavBarToggle () {
     return this.navBarToggle.click();
  }

  /* Sign in button in nav bar */
  get signIn () {
     return element(by.cssContainingText('.nav.navbar-nav.navbar-utility', 'Log In'));
  }
  clickSignIn () {
     this.signIn.click();
     return new OpenShiftIoRHDLoginPage();
  }

  /* Status icon */
  get statusIcon () {
     return element(by.cssContainingText('pficon.pficon-info', 'Status'));
  }
  clickStatusIcon () {
     return this.statusIcon.click();
  }

  /* Platform status */
  get platformStatus () {
    return element(by.xpath("[.//text()[contains(.,'Platform')]]/.."));
  }
  clickPlatformStatus () {
    return this.platformStatus.cliick();
  }

  /* Planner status */
  get plannerStatus () {
    return element(by.xpath("[.//text()[contains(.,'Planner')]]/.."));
  }
  clickPlannerStatus () {
    return this.plannerStatus.cliick();
  }

  /* Che status */
  get cheStatus () {
    return element(by.xpath("[.//text()[contains(.,'Che')]]/.."));
  }
  clickCheStatus () {
    return this.cheStatus.cliick();
  }

  /* Pipeline status */
  get pipelineStatus () {
    return element(by.xpath("[.//text()[contains(.,'Pipeline')]]/.."));
  }
  clickPipelineStatus () {
    return this.pipelineStatus.cliick();
  }




  /* UI Element for new users to register */

  /* Email address */
  get email () {
     return element(by.css("#email"));
  }
  clickEmail () {
     return this.email.click();
  }
  setEmail (emailString) {
    return this.email.sendKeys(emailString);
  }

  /* Access code (voucher code) */
  get voucherCode () {
     return element(by.css("#vouchercode"));
  }
  clickVouchercode () {
     return this.vouchercode.click();
  }
  setVoucherCode (vouchercodeString) {
    return this.voucherCode.sendKeys(vouchercodeString);
  }

  /* Register button */
  get registerButton () {
     return element(by.css("#register"));
  }
  clickRegisterButton () {
     return this.registerButton.click();
  }

  /* Toaster alert that registration was submitted */

  /* Text in toaster alert */
  get toastMessage () {
     return element(by.css("#toastMessage"));
  }

  /* The "X" close button for the toaster alert */
  get toastMessageCloseButton () {
     return element(by.css(".pficon.pficon-close"));
  }
  clickToastMessageCloseButton () {
     browser.wait(until.elementToBeClickable(this.toastMessageCloseButton), constants.WAIT, 'Failed to find toastMessageCloseButton');
     return this.toastMessageCloseButton.click();
  }

  /* The circle "X" close icon for the toaster alert */
  get toastMessageCloseIcon () {
     return element(by.css(".pficon.pficon-error-circle-o"));
  }
  clickToastMessageCloseIcon () {
     browser.wait(until.elementToBeClickable(this.toastMessageCloseIcon), constants.WAIT, 'Failed to find toastMessageCloseIcon');
     return this.toastMessageCloseIcon.click();
  }

  /* Login for already registered users */

  /* Login button */
  get loginButton () {
     return element(by.cssContainingText('.btn.btn-link', 'Log In'));
  }
  clickLoginButton () {
     this.loginButton.click();
     return new OpenShiftIoRHDLoginPage();
  }

  /* Analysis of Component/Bayesian UI elements */

  /* Ecosystem */
  get ecosystem  () {
     return element(by.css("#ecosystem"));
  }
  clickEcosystem () {
     return this.ecosystem.click();
  }
  setEcosystem (ecosystemString) {
    return this.ecosystem.sendKeys(ecosystemString);
  }

  /* Component */
  get component () {
     return element(by.css("#component"));
  }
  clickComponent () {
     return this.component.click();
  }
  setComponent (componentString) {
    return this.component.sendKeys(componentString);
  }

  /* Version */
  get version () {
     return element(by.css("#version"));
  }
  clickVersion () {
     return this.version.click();
  }
  setVersion (VersionString) {
    return this.version.sendKeys(VersionString);
  }

  /* Submit button */
  get submitButton () {
     return element(by.css("#stackbtn"));
  }
  clickSubmitButton () {
     return this.submitButton.click();
  }

  /* Manifest file to upload */

  /* Browse button */
  get browseButton () {
     return element(by.css("#stackAnalysesFile"));
  }
  clickBrowseButton () {
     return this.browseButton.click();
  }

  /* File upload button */
  get uploadButton () {
     return element(by.css("#stacAnalysesFileUpload"));
  }
  clickUploadButton () {
     return this.uploadButton.click();
  }

}

module.exports = OpenShiftIoStartPage;
