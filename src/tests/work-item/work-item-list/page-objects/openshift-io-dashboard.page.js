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
    OpenShiftIoSpaceHomePage = require('../page-objects/openshift-io-spacehome.page');

var until = protractor.ExpectedConditions;

class OpenShiftIoDashboardPage {

  constructor() {
  };

  /* -----------------------------------------------------------------*/
  
  /* Header dropdown - leftmost in navigation bar - displys current space name */
  get headerDropDownToggle () {
    return element(by.id("header_dropdownToggle"));
  }

  clickHeaderDropDownToggle () {
    browser.wait(until.elementToBeClickable(this.headerDropDownToggle), constants.LONG_WAIT, 'Failed to find headerDropDownToggle');
    this.headerDropDownToggle.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:headerDropDownToggle");
    });
    return;
  }
  
/* 
Page layout as of April 24, 2017 - UI elements for Nav bar are in: openshift-io-dashboard.page.js, lower sections are page-specific.

|------------------------------------------------------------------------------------------------------------------------------|
|                                                    Top Navigation Bar                                                        |
| Left Navigation Bar            |                                                            | Right Navigation Bar           |
|                                |                                                            |                                | 
|------------------------------------------------------------------------------------------------------------------------------|
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|        Page-specific content          |          Page-specific content               |        Page-specific content          |
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|------------------------------------------------------------------------------------------------------------------------------|
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|        Page-specific content          |          Page-specific content               |        Page-specific content          |
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|------------------------------------------------------------------------------------------------------------------------------|
*/

  /* Dialog to create new space and project */

  get newSpaceName () {
    return element(by.id("name"));
   }
  typeNewSpaceName (nameString) {
    browser.wait(until.elementToBeClickable(this.newSpaceName), constants.LONG_WAIT, 'Failed to find new space name field');
    return this.newSpaceName.sendKeys(nameString);
  }

  get createSpaceButton () {
    return element(by.buttonText('Create Space'));
  }
  clickCreateSpaceButton () {
    browser.wait(until.elementToBeClickable(this.createSpaceButton), constants.LONG_WAIT, 'Failed to find element createSpaceButton');
    this.createSpaceButton.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:createSpaceButton");
    });
    return;
  }

  get devProcessPulldown () {
    return element(by.id("developmentProcess"));
  }
  clickDevProcessPulldown () {
    this.devProcessPulldown.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:noThanksButton");
    });
    return;
  }

  typeDevProcess (processString) {
    browser.wait(until.elementToBeClickable(this.devProcessPulldown), constants.LONG_WAIT, 'Failed to find new space name dev process');
    return this.devProcessPulldown.sendKeys(processString);
  }

  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
  }
  clickNoThanksButton () {
    browser.wait(until.elementToBeClickable(this.noThanksButton), constants.LONG_WAIT, 'Failed to find element noThanksButton button');
    this.noThanksButton.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:noThanksButton");
    });
    return new OpenShiftIoSpaceHomePage();
  }

  /* -----------------------------------------------------------------*/

  /* Are any warning displayed? */
  get alertToastElements () {
    return element(by.xpath(".//*[contains(@class, 'toast-pf')]"));
  }

  waitForToastToClose () {
    return browser.wait(until.not(until.presenceOf(this.alertToastElements)));
  }

 /* -----------------------------------------------------------------*/

  /* Did the App/Project Creation Fail? */
  get appGenerationError () {
    return element(by.xpath(".//*[contains(text(), 'Application Generator Error')]"));
  }

  waitForAppGenErrorToClose () {
    return browser.wait(until.not(until.presenceOf(this.alertToastElements)));
  }


  /* -----------------------------------------------------------------*/
  /* UI Page Section: Navigation Bar */

  get topNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-collapse')]"));
  }
  clicktopNavigationBar () {
    browser.wait(until.elementToBeClickable(this.topNavigationBar), constants.LONG_WAIT, 'Failed to find element topNavigationBar');
    this.topNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:topNavigationBar");
    });
    return;
  }

  /* -----------------------------------------------------------------*/
  /* UI Page Section: Left Navigation Bar */

  get leftNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-left')]"));
  }
  clickleftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.leftNavigationBar), constants.LONG_WAIT, 'Failed to find element leftNavigationBar');
    this.leftNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:leftNavigationBar");
    });
    return;
  }

  /* User name or space name in Left Navigation Bar */
  nameUnderLeftNavigationBar (nameString) {
    var xpathString = ".//*[contains(@class, 'navbar-left')]//*[contains(text(), '" + nameString + "')]";
    return element(by.xpath(xpathString));
  }
  clickNameUnderLeftNavigationBar (nameString) {
    browser.wait(until.elementToBeClickable(this.nameUnderLeftNavigationBar(nameString)), constants.LONG_WAIT, 'Failed to find element username under leftNavigationBar');
    this.nameUnderLeftNavigationBar(nameString).click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:nameUnderLeftNavigationBar");
    });
    return;
  }

  /* Recent items under Left Navigation Bar */
  get recentItemsUnderLeftNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]"));
  }

  /* Create space in Left Navigation Bar */
    get createSpaceUnderLeftNavigationBar () {
    return element(by.xpath("//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//*[contains(@class,'pficon-add-circle-o')]"));
  }
  clickCreateSpaceUnderLeftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.createSpaceUnderLeftNavigationBar), constants.LONG_WAIT, 'Failed to find element createSpaceUnderLeftNavigationBar');
    this.createSpaceUnderLeftNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:createSpaceUnderLeftNavigationBar");
    });
    return;
  }

  /* View all spaces in Left Navigation Bar */
  get viewAllSpacesUnderLeftNavigationBar () {
    return element(by.xpath("//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//*[contains(@class,'fa-th')]"));
  }
  clickViewAllSpacesUnderLeftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.viewAllSpacesUnderLeftNavigationBar), constants.LONG_WAIT, 'Failed to find element viewAllSpacesUnderLeftNavigationBar');
    this.viewAllSpacesUnderLeftNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:viewAllSpacesUnderLeftNavigationBar");
    });
    return;
  }

  /* Account home in Left Navigation Bar */
  get accountHomeUnderLeftNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//i[contains(@class,'pficon-home')]"));
  }
  clickAccountHomeUnderLeftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.accountHomeUnderLeftNavigationBar), constants.LONG_WAIT, 'Failed to find element accountHomeUnderLeftNavigationBar');
    this.accountHomeUnderLeftNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:accountHomeUnderLeftNavigationBar");
    });
    return;
  }

  /* -----------------------------------------------------------------*/
  /* UI Page Section: Right Navigation Bar */

  get rightNavigationBar () {
    return element(by.id("header_rightDropdown"));
  }
  clickrightNavigationBar () {
    browser.wait(until.elementToBeClickable(this.rightNavigationBar), constants.LONG_WAIT, 'Failed to find element rightNavigationBar');
    this.rightNavigationBar.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:rightNavigationBar");
    });
    return;
  }

  /* Status icon */
  get statusIcon () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')]"));
  }
  clickStatusIcon () {
    browser.wait(until.elementToBeClickable(this.statusIcon), constants.LONG_WAIT, 'Failed to find element statusIcon');
    this.statusIcon.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:statusIcon");
    });
    return;
  }

  get statusIconPlatform () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][1]"));
  }
  clickStatusIconPlatform () {
    browser.wait(until.elementToBeClickable(this.statusIconPlatform), constants.LONG_WAIT, 'Failed to find element statusIconPlatform');
    this.statusIconPlatform.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:statusIconPlatform");
    });
    return;
  }

  get statusIconPlanner () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][2]"));
  }
  clickStatusIconPlanner () {
    browser.wait(until.elementToBeClickable(this.statusIconPlanner), constants.LONG_WAIT, 'Failed to find element statusIconPlatnner');
    this.statusIconPlanner.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:statusIconPlanner");
    });
    return;
  }

  get statusIconChe () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][3]"));
  }
  clickStatusIconChe () {
    browser.wait(until.elementToBeClickable(this.statusIconChe), constants.LONG_WAIT, 'Failed to find element statusIconChe');
    this.statusIconChe.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:statusIconChe");
    });
    return;
  }

  get statusIconPipeline () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][3]"));
  }
  clickStatusIconPipeline () {
    browser.wait(until.elementToBeClickable(this.statusIconPipeline), constants.LONG_WAIT, 'Failed to find element statusIconPipeline');
    this.statusIconPipeline.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:statusIconPipeline");
    });
    return;
  }

  /* Profile drop down selection */
  get profile () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Profile')]"));
  }
  clickProfile () {
    browser.wait(until.elementToBeClickable(this.profile), constants.LONG_WAIT, 'Failed to find Profile');
    this.help.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:profile");
    });
    return;
  }

  /* Help drop down selection */
  get help () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Help')]"));
  }
  clickHelp () {
    browser.wait(until.elementToBeClickable(this.help), constants.LONG_WAIT, 'Failed to find Help');
    this.help.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:help");
    });
    return;
  }

  /* About drop down selection */
  get about () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'About')]"));
  }
  clickAbout () {
    browser.wait(until.elementToBeClickable(this.about), constants.LONG_WAIT, 'Failed to find About');
    this.about.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:about");
    });
    return;
  }

  /* Log Out drop down selection */
  get logOut () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Log Out')]"));
  }
  clickLogOut () {
    browser.wait(until.elementToBeClickable(this.logOut), constants.LONG_WAIT, 'Failed to find logOut');
    this.logOut.click().then(function(){
      console.log("OpenShiftIoDashboardPage - clicked element:logOut");
    });
    return;
  }

}

module.exports = OpenShiftIoDashboardPage;
