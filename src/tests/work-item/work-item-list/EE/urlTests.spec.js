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
        /* Step 1 - on start page, login via github */
    OpenShiftIoRHDLoginPage = page.clickLoginButton();
    OpenShiftIoGithubLoginPage = OpenShiftIoRHDLoginPage.clickGithubLoginButton();
    
       /* Step 2 - on github login page, login */
    OpenShiftIoGithubLoginPage.clickGithubLoginField();
    OpenShiftIoGithubLoginPage.typeGithubLoginField(browser.params.login.user); 

    OpenShiftIoGithubLoginPage.clickGithubPassword();
    OpenShiftIoGithubLoginPage.typeGithubPassword(browser.params.login.password);   
    OpenShiftIoDashboardPage = OpenShiftIoGithubLoginPage.clickGithubLoginButton();
    
    browser.wait(until.elementToBeClickable(page.loginButton), constants.WAIT); 
    page.clickLoginButton();

    expect(browser.getCurrentUrl()).toBe("https://openshift.io/"); 
    browser.wait(until.urlContains('https://openshift.io/_home/'), constants.WAIT);

  });

  it('Settings page :: ', function() {
    page.clickLoginButton();
    urlsPage.settingsUrl(browser.params.target.url,browser.params.login.user+"1");
    expect(SettingPage.profileName.getText()).toBe("almightytest");
    expect(SettingPage.profilePage.getText()).toBe("Profile");
    expect(SettingPage.profileEmail.getText()).toBe("redhat-devlopers-test@redhat.com");
    expect(SettingPage.profileURL.getText()).toBe("");
    expect(SettingPage.saveButton().isPresent()).toBe(true);
  });
  
  it('Resource page :: ', function() {
    page.clickLoginButton();
    urlsPage.resourcesUrl(browser.params.target.url,browser.params.login.user+"1");
    expect(ResourcePage.profileName.isPresent()).toBe(true);
    
  });
});
