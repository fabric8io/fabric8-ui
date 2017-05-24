/**Note on screen resolutions - See: http://www.itunesextractor.com/iphone-ipad-resolution.html
 * Tests will be run on these resolutions:
 * - iPhone6s - 375x667
 * - iPad air - 768x1024
 * - Desktop -  1920x1080
 *
 * beforeEach will set the mode to Desktop. Any tests requiring a different resolution will must set explicitly.
 *
 * @author naina-verma
 */


describe('URL Test Suite :: ', function () {
  var page; 
  var until = protractor.ExpectedConditions;
  var OpenShiftIoStartPage = require('../page-objects/openshift-io-start.page'),
    OpenShiftIoRHDLoginPage = require('../page-objects/openshift-io-RHD-login.page'),
    OpenShiftIoGithubLoginPage = require('../page-objects/openshift-io-github-login.page'),
    OpenShiftIoDashboardPage = require('../page-objects/openshift-io-dashboard.page'),
    OpenShiftIoSpaceHomePage = require('../page-objects/openshift-io-spacehome.page'),
    OpenShiftIoRegistrationPage = require('../page-objects/openshift-io-registration.page'),
    testSupport = require('../testSupport'),
    Common = require('../page-objects/common.page'),
    Settings = require('../page-objects/settings.page'),
    Resource = require('../page-objects/resources.page'),
    constants = require("../constants");

  beforeEach(function () {
    testSupport.setBrowserMode('desktop');
    urlsPage =new Common();
    SettingPage = new Settings();
    ResourcePage = new Resource();
    // Failed: Error while waiting for Protractor to sync with the page: "window.getAllAngularTestabilities is not a function"
    // http://stackoverflow.com/questions/38050626/angular-2-with-protractorjs-failed-error-while-waiting-for-protractor-to-sync-w 
    browser.ignoreSynchronization = true;
    page = new OpenShiftIoStartPage(browser.params.target.url);  
  });

  it('Login to openshiftio :: ', function() {
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
    
  });

  it('Space All  :: ', function() {
     
    urlsPage.spacesUrl(browser.params.target.url,browser.params.login.user+"1");
    expect(urlsPage.linkTextGeneric("TestingSpace").isPresent()).toBe(true);
    expect(browser.getCurrentUrl()).toContain(browser.params.login.user+"1"+"/_spaces");
    //Title TBD
  });

  it('Space Specified   :: ', function() {
     
    urlsPage.spaceDashboard(browser.params.target.url,browser.params.login.user+"1","TestingSpace");
    expect(browser.getCurrentUrl()).toContain("/TestingSpace");
    
  });

  it('WorkItems List view with Space   :: List/tree view of all work-items ', function() {
     
    urlsPage.workitemslistPlan(browser.params.target.url,browser.params.login.user+"1","TestingSpace");
    expect(browser.getCurrentUrl()).toContain("/TestingSpace/plan");
    
  });

  it('WorkItems with ID List view with Space  ', function() {
     
    urlsPage.workitemWithId(browser.params.target.url,browser.params.login.user+"1","TestingSpace","750");
    expect(browser.getCurrentUrl()).toContain("/TestingSpace/plan/detail/750");
    
  });

  it('Board view with space  ', function() {
     
    urlsPage.boardItemViewUrl(browser.params.target.url,browser.params.login.user+"1","TestingSpace");
    expect(browser.getCurrentUrl()).toContain("TestingSpace/plan/board");
    
  });

 it('Board view with Query space  ', function() {
     
    urlsPage.boardItemQueryUrl(browser.params.target.url,browser.params.login.user+"1","TestingSpace","workitemtype=Task&assignee=naverma%40redhat.com(me)");
    expect(browser.getCurrentUrl()).toContain(browser.params.target.url+browser.params.login.user+"1"+"/TestingSpace/plan/board?workitemtype=Task&assignee=naverma%40redhat.com(me)");
    
  });

 it('Iterations view with Query space  ', function() {
     
    urlsPage.viewIteration(browser.params.target.url,browser.params.login.user+"1","TestingSpace","%2FTestingSpace%2FtestIteration");
    expect(browser.getCurrentUrl()).toContain(browser.params.target.url+browser.params.login.user+"1"+"/TestingSpace/plan?iteration=%2FTestingSpace%2FtestIteration");
    
  });

 it('Iterations with Child view with Query space  ', function() {
     
    urlsPage.viewIteration(browser.params.target.url,browser.params.login.user+"1","TestingSpace","%2FTestingSpace%2FtestIteration%2Fchild");
    expect(browser.getCurrentUrl()).toContain(browser.params.target.url+browser.params.login.user+"1"+"/TestingSpace/plan?iteration=%2FTestingSpace%2FtestIteration%2Fchild");
    
  });


/**Area's URL looks inapproriate  TBD' https://docs.google.com/spreadsheets/d/1cNSDuek0v1EBPpdPlFwG_Y_yOlux86m9MYf9UrF82l4/edit#gid=208615194*/
/**Codebases's URL looks inapproriate  TBD' */
/**Workspaces 's URL looks inapproriate  TBD' */

  it('Settings page :: ', function() {
    page.loginButton.isPresent().then(function(result) {
      if ( result ) {
        page.clickLoginButton();
      } else {
        //do nothing
      }
    });
    urlsPage.settingsUrl(browser.params.target.url,browser.params.login.user+"1");
    expect(SettingPage.profileName.getText()).toBe("almightytest");
    expect(SettingPage.profilePage.getText()).toBe("Profile");
    expect(SettingPage.profileEmail.getText()).toBe("redhat-devlopers-test@redhat.com");
    expect(SettingPage.profileURL.getText()).toBe("");
    expect(SettingPage.saveButton().isPresent()).toBe(true);  
  });
  
  it('Resource page :: ', function() {
      // page.clickLoginButton();
    urlsPage.resourcesUrl(browser.params.target.url,browser.params.login.user+"1");
    expect(ResourcePage.resoucePage.isPresent()).toBe(true);
    
  });

});
