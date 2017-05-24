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
    constants = require("../constants"),
    Common = require('../page-objects/common.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page');

var until = protractor.ExpectedConditions;

class OpenShiftIoStartPage {

  constructor(startUrl) {
//    browser.get("https://prod-preview.openshift.io/");
//    browser.get("https://openshift.io/");
  browser.get(startUrl);
  };

  /* Navigation panel UI objects */

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
    this.navBar.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: navBar");
    });
    return;
  }

  /* OpenShift.io image */
  get openShiftIoImage () {
     return element(by.css(".navbar-brand>img"));
  }
  clickOpenShiftIoImage () {
    this.openShiftIoImage.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: openShiftIoImage");
    });
    return;
  }

  /* The navigation bar  */
  get navBar () {
     return element(by.css(".navbar-header"));
  }
  clickNavBar () {
    this.navBar.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: navBar");
    });
    return;
  }

  /* Navigation bar toggle (non-desktop mode only) */
  get navBarToggle () {
     return element(by.css(".navbar-toggle"));
  }
  clickNavBarToggle () {
    this.navBarToggle.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: navBarToggle");
    });
    return;
  }

  /* Sign in button in nav bar */
  get signIn () {
     return element(by.cssContainingText('.nav.navbar-nav.navbar-utility', 'Log In'));
  }
  clickSignIn () {
     this.signIn.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: signIn");
    });
    return new OpenShiftIoRHDLoginPage();
  }

  /* Status icon */
  get statusIcon () {
     return element(by.cssContainingText('pficon.pficon-info', 'Status'));
  }
  clickStatusIcon () {
    this.statusIcon.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: statusIcon");
    });
    return;
  }

  /* Platform status */
  get platformStatus () {
    return element(by.xpath("[.//text()[contains(.,'Platform')]]/.."));
  }
  clickPlatformStatus () {
    this.platformStatus.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: platformStatus");
    });
    return;
  }

  /* Planner status */
  get plannerStatus () {
    return element(by.xpath("[.//text()[contains(.,'Planner')]]/.."));
  }
  clickPlannerStatus () {
    this.plannerStatus.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: plannerStatus");
    });
    return;
  }

  /* Che status */
  get cheStatus () {
    return element(by.xpath("[.//text()[contains(.,'Che')]]/.."));
  }
  clickCheStatus () {
    this.cheStatus.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: cheStatus");
    });
    return;
  }

  /* Pipeline status */
  get pipelineStatus () {
    return element(by.xpath("[.//text()[contains(.,'Pipeline')]]/.."));
  }
  clickPipelineStatus () {
    this.pipelineStatus.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: pipelineStatus");
    });
    return;
  }

  /* UI Element for new users to register */

  /* Email address */
  get email () {
     return element(by.css("#email"));
  }
  clickEmail () {
    this.email.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: email");
    });
    return;
  }
  setEmail (emailString) {
    return this.email.sendKeys(emailString);
  }

  /* Access code (voucher code) */
  get voucherCode () {
     return element(by.css("#vouchercode"));
  }
  clickVouchercode () {
    this.vouchercode.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: voucherCode");
    });
    return;
  }
  setVoucherCode (vouchercodeString) {
    return this.voucherCode.sendKeys(vouchercodeString);
  }

  /* Register button */
  get registerButton () {
     return element(by.css("#register"));
  }
  clickRegisterButton () {
    this.registerButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: registerButton");
    });
    return;
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
    this.toastMessageCloseButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: toastMessageCloseButton");
    });
    return;
  }

  /* The circle "X" close icon for the toaster alert */
  get toastMessageCloseIcon () {
     return element(by.css(".pficon.pficon-error-circle-o"));
  }
  clickToastMessageCloseIcon () {
    browser.wait(until.elementToBeClickable(this.toastMessageCloseIcon), constants.WAIT, 'Failed to find toastMessageCloseIcon');
    this.toastMessageCloseIcon.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: toastMessageCloseIcon");
    });
    return;
  }

  /* Analysis of Component/Bayesian UI elements */

  /* Ecosystem */
  get ecosystem  () {
     return element(by.css("#ecosystem"));
  }
  clickEcosystem () {
    this.ecosystem.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: ecosystem");
    });
    return;
  }
  setEcosystem (ecosystemString) {
    return this.ecosystem.sendKeys(ecosystemString);
  }

  /* Component */
  get component () {
     return element(by.css("#component"));
  }
  clickComponent () {
    this.component.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: component");
    });
    return;
  }
  setComponent (componentString) {
    return this.component.sendKeys(componentString);
  }

  /* Version */
  get version () {
     return element(by.css("#version"));
  }
  clickVersion () {
    this.version.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: version");
    });
    return;
  }
  setVersion (VersionString) {
    return this.version.sendKeys(VersionString);
  }

  /* Submit button */
  get submitButton () {
     return element(by.css("#stackbtn"));
  }
  clickSubmitButton () {
    this.submitButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: submitButton");
    });
    return;
  }

  /* Manifest file to upload */

  /* Browse button */
  get browseButton () {
     return element(by.css("#stackAnalysesFile"));
  }
  clickBrowseButton () {
    this.browseButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: browseButton");
    });
    return;
  }

  /* File upload button */
  get uploadButton () {
     return element(by.css("#stacAnalysesFileUpload"));
  }
  clickUploadButton () {
    this.uploadButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: uploadButton");
    });
    return;
  }

  /* -----------------------------------------------------------------*/

  /* Login for already registered users */

  /* Login button in Nav bar*/
  get navBarLoginButton () {
     return element(by.xpath(".//*[contains(@class,'navbar')]//a[@id='login'"));
  }
  clickNavBarLoginButton () {
     this.navBarLoginButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: navBarLoginButton");
    });
     return new OpenShiftIoRHDLoginPage();
  }

  /* Login button */
  get loginButton () {
    return element(by.xpath(".//*[@id='signUp']//*[@id='login']"));
  }
  clickLoginButton () {
     this.loginButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: loginButton");
    });
     return new OpenShiftIoRHDLoginPage();
  }

  /* Botton of the page Login button */
  get bottomLoginButton () {
    return element(by.xpath(".//*[@id='bottomSignUp']//*[@id='login']"));
  }
  clickBottomLoginButton () {
     this.bottomLoginButton.click().then(function(){
      console.log("OpenShiftIoStartPage - clicked element: bottomLoginButton");
    });
     return new OpenShiftIoRHDLoginPage();
  }

}

module.exports = OpenShiftIoStartPage;
