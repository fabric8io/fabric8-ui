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
 * @author ldimaggi, nverma
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

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage(browser.params.target.url);  
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 360000;
  });

  /* Simple test for registered user */
  it('should enable a registered user create a space, project, etc. ', function() {
    
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

    /* Step 3 - on home page - create new space - embed time in space name to ensure unique space name */
    OpenShiftIoDashboardPage.clickHeaderDropDownToggle();
    OpenShiftIoDashboardPage.clickCreateSpaceUnderLeftNavigationBar();  

    var spaceTime = returnTime();
    OpenShiftIoDashboardPage.typeNewSpaceName((spaceTime));
    OpenShiftIoDashboardPage.typeDevProcess("Scenario Driven Planning");
    OpenShiftIoDashboardPage.clickCreateSpaceButton();   

    /* For the purposes of this test - ignore all 'toast' popup warnings */
    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage = OpenShiftIoDashboardPage.clickNoThanksButton();

    /* Step - in the space home page, verify URL and end the test */
    browser.wait(until.urlContains('https://openshift.io/almusertest1/'+ spaceTime), constants.WAIT);
    browser.wait(until.urlIs('https://openshift.io/almusertest1/'+ spaceTime), constants.WAIT); 
    expect(browser.getCurrentUrl()).toEqual('https://openshift.io/almusertest1/'+ spaceTime);

    browser.getCurrentUrl().then(function (text) { 
       console.log ('EE POC test - new space URL = ' + text);
    });

    /* Add a project to the space */
    OpenShiftIoDashboardPage.waitForToastToClose();
    OpenShiftIoSpaceHomePage.clickPrimaryAddToSpaceButton();  
    OpenShiftIoSpaceHomePage.clickTechnologyStack();
    OpenShiftIoSpaceHomePage.clickQuickStartFinishButton();

    OpenShiftIoSpaceHomePage.clickOkButton();

    /* TODO - Trap 'Application Generation Error' here - if found, fail test and exit */
    expect(OpenShiftIoDashboardPage.appGenerationError.isPresent()).toBe(false);

    /* May 26, 2017 - "no thanks" button removed from the UI */
    //OpenShiftIoSpaceHomePage.clickNoThanksButton();

     /* May 28, 2017 - UI has changed - this step is not needed */
    /* Import the code base */
    //OpenShiftIoSpaceHomePage.clickImportCodebaseButton();
    //var targetURL = "https://github.com/almightytest/" + spaceTime + ".git";
    //OpenShiftIoSpaceHomePage.setGitHubRepo(targetURL);
    //OpenShiftIoSpaceHomePage.clickSyncButton();

    //OpenShiftIoDashboardPage.waitForToastToClose();
    //OpenShiftIoSpaceHomePage.clickAssociateRepoButton();
    OpenShiftIoDashboardPage.waitForToastToClose();

    /* TODO - Create a workspace */

    /* Navigating thru the Plan/Create/Analyze tabs is not working in the UI - due to 
       Angular bug with Protractor? Navigate directly to the URL instead */
    // OpenShiftIoSpaceHomePage.clickHeaderAnalyze();
//    var tmpString = "https://openshift.io/almusertest1/" + spaceTime + "/create";

    /* Go to the Create page - https://openshift.io/almusertest1/testmay91494369460731/create  */
    browser.get("https://openshift.io/almusertest1/" + spaceTime + "/create");
    
    /* Locate the first codebase */
    OpenShiftIoSpaceHomePage.clickFirstPipeline();

    /* TODO - Verify the workspace in Che - TODO - Create a page object modelk for the Che dashboard */
    browser.get("https://che-almusertest1-che.8a09.starter-us-east-2.openshiftapps.com/dashboard/#/");

    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[@id='dashboardPageContent']/dashboard-last-workspaces"))), constants.LONG_WAIT, 'Failed to find element Che dashboard');
    element(by.xpath(".//*[@id='dashboardPageContent']/dashboard-last-workspaces")).getText().then(function(text){
      console.log("Che workspaces = " + text);
    });

    /* Verify that the pipeline was created */

    /* Navigating thru the Plan/Create/Analyze tabs is not working in the UI - due to 
       Angular bug with Protractor? Navigate directly to the URL instead */
    // OpenShiftIoSpaceHomePage.clickHeaderAnalyze();
    browser.get("https://openshift.io/almusertest1/" + spaceTime);

    OpenShiftIoSpaceHomePage.clickPipelinesSectionTitle();
    OpenShiftIoSpaceHomePage.pipelinesPage.getText().then(function(text){
    //  console.log("Pipelines page = " + text);

      /* May 9, 2017 - clicking on a pipeline fails due to this error:
      https://openshift.io/kleinhenz-1/osio-planner/plan/detail/682    *
      /* Example of expected text:
         testmay91494354476064 created a few seconds ago
         Source Repository: https://github.com/almightytest/testmay91494354476064.git
         No pipeline builds have run for testmay91494354476064.   */

      expect(text).toContain("No pipeline builds have run for " + spaceTime);
      expect(text).toContain("Source Repository: https://github.com/almightytest/" + spaceTime + ".git");
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
