/**
 * POC test for automated UI tests for openshift.io
 *  
 * Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 * 
 * beforeEach will set the mode to phone. Any tests requiring a different resolution will must set explicitly. 
 * 
 * @author ldimaggi, bsutter
 */

var until = protractor.ExpectedConditions;

var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page'),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page'),
    OpenShiftIoSpaceHomePage = require('../page-objects/openshift-io-spacehome.page'),
    OpenShiftIoRegistrationPage = require('../page-objects/openshift-io-registration.page'),
    testSupport = require('../testSupport'),
    constants = require("../constants");

describe('openshift.io End-to-End POC test - Scenario - Existing user: ', function () {
  var page, items, browserMode;

  /* Set up for each function */
  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage(browser.params.target.url);  
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 360000;
  });

  /* Tests must reset the browser so that the test can logout/login cleanly */
  afterEach(function () { 
    browser.restart();
    /* Protractor must recreate its ExpectedConditions */
    until = protractor.ExpectedConditions;
  });

  /* Simple test for registered user */
  it('should enable a registered user create a space, project, etc. ', function() {
    
    /* Protractor must recreate its ExpectedConditions if the browser is restarted */
    until = protractor.ExpectedConditions;
    
    console.log ("Test for target URL: " + browser.params.target.url)

    /* Step 1 - on start page, login via github */
    OpenShiftIoRHDLoginPage = page.clickLoginButton();
    OpenShiftIoGithubLoginPage = OpenShiftIoRHDLoginPage.clickGithubLoginButton();

    /* Step 2 - on github login page, login */
    OpenShiftIoGithubLoginPage.clickGithubLoginField();
    OpenShiftIoGithubLoginPage.typeGithubLoginField(browser.params.login.user); 

    OpenShiftIoGithubLoginPage.clickGithubPassword();
    OpenShiftIoGithubLoginPage.typeGithubPassword(browser.params.login.password);   
    OpenShiftIoDashboardPage = OpenShiftIoGithubLoginPage.clickGithubLoginButton();

    /* Seeing a problem where login is failing on Centos CI */    
    OpenShiftIoGithubLoginPage.incorrectUsernameOrPassword.isPresent().then(function(result) {
      if ( result ) {
        console.log("UNEXPECTED ERROR - INCORRECT USERNAME OR PASSWORD ENTERED"); 
        console.log ("Username entered = " + browser.params.login.user);
      } else {
        //do nothing 
      }
    });

    /* This button appears after a large number of logins with the same account */
    OpenShiftIoGithubLoginPage.authorizeApplicationButton.isPresent().then(function(result) {
      if ( result ) {
        OpenShiftIoGithubLoginPage.clickAuthorizeApplicationButton();
      } else {
        //do nothing
      }
    });

    /* Step 5 - log out */

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    OpenShiftIoDashboardPage.waitForToastToClose();

    OpenShiftIoDashboardPage.clickrightNavigationBar();
    OpenShiftIoDashboardPage.clickLogOut();
  });

});

  /* Get system time in seconds since 1970 */
  var returnTime = function () {

    var month = new Array();
    month[0] = "jan";
    month[1] = "feb";
    month[2] = "mar";
    month[3] = "apr";
    month[4] = "may";
    month[5] = "jun";
    month[6] = "jul";
    month[7] = "aug";
    month[8] = "sep";
    month[9] = "oct";
    month[10] = "nov";
    month[11] = "dec";

    var d = new Date();
    var m = month[d.getMonth()];
    var day = d.getDate(); 
    var n = d.getTime();
 
    console.log ("EE POC test - Creating space: " + m + day.toString() + n.toString());
    return "test" +  m + day.toString() + n.toString();
  }
