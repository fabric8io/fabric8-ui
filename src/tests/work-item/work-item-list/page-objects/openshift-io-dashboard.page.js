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

  const devProcesses  = {
    Agile: 0,
    Scrum: 1,
    IssueTracking: 2,
    ScenarioDrivenPlanning: 3
  }

class OpenShiftIoDashboardPage {

  constructor() {
  };

  get welcomeText () {
    var xpathStr = ".//*[contains(text(),'Welcome to OpenShift.io, an end-to-end team development environment in the cloud.')]";
    browser.wait(until.presenceOf(element(by.xpath(xpathStr))), constants.LONG_WAIT, 'Failed to find welcome message');
     return element(by.xpath(xpathStr));
  }

  get newSpaceButton () {
    return element(by.xpath(".//a[contains(text(),'New')]"));
  }
  clickNewSpaceButton () {
    browser.wait(until.presenceOf(this.newSpaceButton), constants.LONG_WAIT, 'Failed to find new space buton');
    return this.newSpaceButton.click();
  }

  get newSpaceName () {
    return element(by.id("name"));
   }
  typeNewSpaceName (nameString) {
    browser.wait(until.elementToBeClickable(this.newSpaceName), constants.LONG_WAIT, 'Failed to find new space name field');
    return this.newSpaceName.sendKeys(nameString);
  }

  get devProcessPulldown () {
    return element(by.id("developmentProcess"));
  }
  clickDevProcessPulldown () {
    return this.devProcessPulldown.click();
  }
  typeDevProcess (processString) {
    browser.wait(until.elementToBeClickable(this.devProcessPulldown), constants.LONG_WAIT, 'Failed to find new space name dev process');
    return this.devProcessPulldown.sendKeys(processString);
  }

  get createSpaceButton () {
    return element(by.buttonText('Create Space'));
  }
  clickCreateSpaceButton () {
    browser.wait(until.elementToBeClickable(this.createSpaceButton), constants.LONG_WAIT, 'Failed to find element createSpaceButton');
    return this.createSpaceButton.click();
  }

  get okButton () {
    return element(by.buttonText('OK'));
  }
  clickOkButton () {
    browser.wait(until.elementToBeClickable(this.okButton), constants.LONG_WAIT, 'Failed to find element okButton');
    return this.okButton.click();
  }

  get cancelButton () {
    return element(by.buttonText('Cancel'));
  }
  clickCancelButton () {
    return this.cancelButton.click();
  }

  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, just take me to')]"));
  }
  clickNoThanksButton () {
    return this.noThanksButton.click();
  }

//  get wizardStepTitle () {
//    return element(by.css(".wizard-step-title"));
//  }
  get cancelXButton () {
    return element(by.css(".glyphicon.glyphicon-remove"));
  }
  clickCancelXButton () {
    return this.cancelXButton.click();
  }

  get closeButton () {
    return element(by.css(".pficon.pficon-close"));
  }
  clickCloseButton () {
    return this.closeButton.click();
  }

  get wizardButton () {
    return element(by.xpath(".//a[contains(text(),'Wizard')]"));
  }
  clickWizardButton () {
    browser.wait(until.elementToBeClickable(this.wizardButton), constants.LONG_WAIT, 'Failed to find element wizardButton');
    return this.wizardButton.click();
  }

  get spaceWizard () {
    return element(by.css(".wizard-container"));
  }
  get newSpaceCancelButton () {
     return this.spaceWizard.element(by.xpath(".//a[contains(text(),'Cancel')]"));
  }
  clickNewSpaceCancelButton () {
    browser.wait(until.elementToBeClickable(this.newSpaceCancelButton), constants.LONG_WAIT, 'Failed to find element newSpaceCancelButton');
    return this.newSpaceCancelButton.click();
  }

  get browseSpaces () {
    return element(by.xpath(".//a[contains(text(),'Browse')]"));
  }
  clickBrowseSpaces () {
    browser.wait(until.elementToBeClickable(this.browseSpaces), constants.LONG_WAIT, 'Failed to find element browseSpaces');
    return this.browseSpaces.click();
  }
  
  selectSpace (spaceName) {
    return element(by.xpath(".//a[contains(text(),'" + spaceName + "')]"));
  }
  clickSelectSpace (spaceName) {
    browser.wait(until.elementToBeClickable(this.selectSpace(spaceName)), constants.LONG_WAIT, 'Failed to find element selected space ' + spaceName);
    this.selectSpace(spaceName).click();
    return new OpenShiftIoSpaceHomePage();
  }

  /* -----------------------------------------------------------------*/
  
  /* Header nav bar - left side of display  */
   get leftNavBar () {
     browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains(@class,'navbar-left')]"))), constants.LONG_WAIT, 'Failed to find NavBarLeft');
     return element(by.xpath(".//*[contains(@class,'navbar-left')]"));
  }

  clickLeftNavBar () {
    this.leftNavBar.click();
  }

  /* Header dropdown - leftmost in navigation bar - displys current space name */
  get headerDropDownToggle () {
    return element(by.id("header_dropdownToggle"));
  }

  clickHeaderDropDownToggle () {
    browser.wait(until.elementToBeClickable(this.headerDropDownToggle), constants.LONG_WAIT, 'Failed to find headerDropDownToggle');
    return this.headerDropDownToggle.click();
  }

  /* Create a new space from within the header dropdown toggle */
  get createSpaceFromNavBar () {
    return this.leftNavBar.element(by.xpath(".//*[contains(@class,'pficon-add-circle-o')]"));
  }

  clickCreateSpaceFromNavBar () {
    browser.wait(until.elementToBeClickable(this.createSpaceFromNavBar), constants.LONG_WAIT, 'Failed to find createSpaceFromHeader');
    return this.createSpaceFromNavBar.click();
  }

  /* View all spaces from within the header dropdown toggle */
  get viewAllSpacesFromNavBar () {
//    return this.leftNavBar.element(by.xpath(".//*[contains(@class,'fa fa-th')]"));
    return this.leftNavBar.element(by.xpath(".//a[contains(@href,'almusertest1/_spaces')]"));
  }
  
  clickViewAllSpacesFromNavBar () {
    browser.wait(until.elementToBeClickable(this.viewAllSpacesFromNavBar), constants.LONG_WAIT, 'Failed to find viewAllSpacesFromNavBar');
    return this.viewAllSpacesFromNavBar.click();
  }

  /* -----------------------------------------------------------------*/

  /* Header nav bar - right side of display  */
   get rightNavBar () {
     browser.wait(until.elementToBeClickable(element(by.id("header_rightDropdown"))), constants.LONG_WAIT, 'Failed to find NavBarRight');
     return element(by.id("header_rightDropdown"));
  }

  clickRightNavBar () {
    this.rightNavBar.click();
  }

  /* -----------------------------------------------------------------*/

  /* Navigation bar on dashboard/user home page */

  get homeTab () {
    return this.leftNavBar.element(by.xpath(".//*[contains(text(),'Home')]"));
  }

  clickHomeTab () {
    this.homeTab.click();
  }
  
  get profileTab () {
    return this.leftNavBar.element(by.xpath(".//*[contains(text(),'Profile')]"));
  }

  clickProfileTab () {
    browser.wait(until.elementToBeClickable(this.profileTab), constants.LONG_WAIT, 'Failed to find profileTab');
    this.profileTab.click();
  }



  /* My Spaces UI card element */
  get mySpacesCard () {
    return element(by.xpath(".//div[contains(@class, 'col-md-4')]//*[contains(text(), 'My spaces')]/../../.."));    
  }  
  
  selectTheSpace (spaceName) {
    return this.mySpacesCard.element(by.xpath("//a[contains(text(),'" + spaceName + "')]"));
  }

  clickTheSpace (spaceName) {
    browser.wait(until.elementToBeClickable(this.selectTheSpace(spaceName)), constants.LONG_WAIT, 'Failed to find element selected space ' + spaceName);
    this.selectTheSpace(spaceName).click();
    return new OpenShiftIoSpaceHomePage();
  }

  /* Are any warning displayed? */
  get alertToastElements () {
    return element(by.xpath(".//*[contains(@class, 'toast-pf')]"));
  }

  waitForToastToClose () {
    return browser.wait(until.not(until.presenceOf(this.alertToastElements)));
  }

  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
  }
  clickNoThanksButton () {
    browser.wait(until.elementToBeClickable(this.noThanksButton), constants.LONG_WAIT, 'Failed to find element noThanksButton button');
    this.noThanksButton.click();
    return new OpenShiftIoSpaceHomePage();
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

  /* UI Page Section: Navigation Bar */

  get topNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-collapse')]"));
  }
  clicktopNavigationBar () {
    browser.wait(until.elementToBeClickable(this.topNavigationBar), constants.LONG_WAIT, 'Failed to find element topNavigationBar');
    return this.topNavigationBar.click();
  }

  /* UI Page Section: Left Navigation Bar */

  get leftNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-left')]"));
  }
  clickleftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.leftNavigationBar), constants.LONG_WAIT, 'Failed to find element leftNavigationBar');
    return this.leftNavigationBar.click();
  }

  /* User name or space name in Left Navigation Bar */
  nameUnderLeftNavigationBar (nameString) {
    var xpathString = ".//*[contains(@class, 'navbar-left')]//*[contains(text(), '" + nameString + "')]";
    return element(by.xpath(xpathString));
  }
  clickNameUnderLeftNavigationBar (nameString) {
    browser.wait(until.elementToBeClickable(this.nameUnderLeftNavigationBar(nameString)), constants.LONG_WAIT, 'Failed to find element username under leftNavigationBar');
    return this.nameUnderLeftNavigationBar(nameString).click();
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
    return this.createSpaceUnderLeftNavigationBar.click();
  }

  /* View all spaces in Left Navigation Bar */
    get viewAllSpacesUnderLeftNavigationBar () {
    return element(by.xpath("//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//*[contains(@class,'fa-th')]"));
  }
  clickViewAllSpacesUnderLeftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.viewAllSpacesUnderLeftNavigationBar), constants.LONG_WAIT, 'Failed to find element viewAllSpacesUnderLeftNavigationBar');
    return this.viewAllSpacesUnderLeftNavigationBar.click();
  }

  /* Account home in Left Navigation Bar */
  get accountHomeUnderLeftNavigationBar () {
    return element(by.xpath(".//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//i[contains(@class,'pficon-home')]"));
  }
  clickAccountHomeUnderLeftNavigationBar () {
    browser.wait(until.elementToBeClickable(this.accountHomeUnderLeftNavigationBar), constants.LONG_WAIT, 'Failed to find element accountHomeUnderLeftNavigationBar');
    return this.accountHomeUnderLeftNavigationBar.click();
  }

  /* UI Page Section: Right Navigation Bar */

  get rightNavigationBar () {
    return element(by.id("header_rightDropdown"));
  }
  clickrightNavigationBar () {
    browser.wait(until.elementToBeClickable(this.rightNavigationBar), constants.LONG_WAIT, 'Failed to find element rightNavigationBar');
    return this.rightNavigationBar.click();
  }

  /* Status icon */
  get statusIcon () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')]"));
  }
  clickStatusIcon () {
    browser.wait(until.elementToBeClickable(this.statusIcon), constants.LONG_WAIT, 'Failed to find element statusIcon');
    return this.statusIcon.click();
  }

  get statusIconPlatform () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][1]"));
  }
  clickStatusIconPlatform () {
    browser.wait(until.elementToBeClickable(this.statusIconPlatform), constants.LONG_WAIT, 'Failed to find element statusIconPlatform');
    return this.statusIconPlatform.click();
  }

  get statusIconPlanner () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][2]"));
  }
  clickStatusIconPlanner () {
    browser.wait(until.elementToBeClickable(this.statusIconPlanner), constants.LONG_WAIT, 'Failed to find element statusIconPlatnner');
    return this.statusIconPlanner.click();
  }

  get statusIconChe () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][3]"));
  }
  clickStatusIconChe () {
    browser.wait(until.elementToBeClickable(this.statusIconChe), constants.LONG_WAIT, 'Failed to find element statusIconChe');
    return this.statusIconChe.click();
  }

  get statusIconPipeline () {
    return element(by.xpath(".//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')][3]"));
  }
  clickStatusIconPipeline () {
    browser.wait(until.elementToBeClickable(this.statusIconPipeline), constants.LONG_WAIT, 'Failed to find element statusIconPipeline');
    return this.statusIconPipeline.click();
  }

  /* Profile drop down selection */
  get profile () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Profile')]"));
  }
  clickProfile () {
     browser.wait(until.elementToBeClickable(this.profile), constants.LONG_WAIT, 'Failed to find Profile');
     return this.help.click();
  }

  /* Help drop down selection */
  get help () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Help')]"));
  }
  clickHelp () {
     browser.wait(until.elementToBeClickable(this.help), constants.LONG_WAIT, 'Failed to find Help');
     return this.help.click();
  }

  /* About drop down selection */
  get about () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'About')]"));
  }
  clickAbout () {
     browser.wait(until.elementToBeClickable(this.about), constants.LONG_WAIT, 'Failed to find About');
     return this.about.click();
  }

  /* Log Out drop down selection */
  get logOut () {
    return element(by.xpath("//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Log Out')]"));
  }
  clickLogOut () {
     browser.wait(until.elementToBeClickable(this.logOut), constants.LONG_WAIT, 'Failed to find logOut');
     return this.logOut.click();
  }






}

module.exports = OpenShiftIoDashboardPage;

