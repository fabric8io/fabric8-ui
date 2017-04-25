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
    constants = require("../constants");

var until = protractor.ExpectedConditions;

class OpenShiftIoSpaceHomePage {

  constructor() {
  };


  /* "Analyze" in page heading */
  get headerAnalyzePlan () {
    return element(by.xpath(".//*[contains(text(),'Analyze')]"));
  }
  clickHeaderAnalyze () {
    browser.wait(until.elementToBeClickable(this.headerAnalyze), constants.LONG_WAIT, 'Failed to find element headerAnalyze');
    return this.headerPlan.click();
  }

  /* Space name as displayed */
  displaySpaceName (spaceNameStr) {
      var xpathStr = ".//*[contains(text(),'" + spaceNameStr + "')]";
      return element(by.xpath(xpathStr));
  }

  /* Analytical Report - title text */
  get analyticalReportHeader () {
    return element(by.xpath(".//h2[contains(text(),'Analytical Report')]"));
  }

  /* Analytical report combobox */
  get analyticalReportCombo () {
      return element(by.css(".combobox.form-control"));
  }

  clickAnalyticalReportCombo () {
      return this.analyticalReportCombo.click();
  }

  /* Workitem title */
  get workitemTitle () {
    return element(by.xpath(".//span[contains(text(),'My Work Items')]"));
  }

  get workitemParent () {
    return element(by.xpath(".//span[contains(text(),'My Work Items')]/../../.."));
  }

  get workitemBadge () {
    return this.workitemParent.element(by.css(".badge"));
  }

  get createWorkitemButton () {
    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains(@class,'btn-lg') and contains(text(),'Create a Work Item')]"))), constants.LONG_WAIT, 'Failed to find create workitem button');
    return element(by.xpath(".//*[contains(@class,'btn-lg') and contains(text(),'Create a Work Item')]"));
  }

  clickCreateWorkitemButton () {
    return this.createWorkitemButton.click(); 
  }

  get createWorkItemIcon () {
    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains(@class,'pficon.pficon-add-circle-o')]"))), constants.LONG_WAIT, 'Failed to find create workitem icon');
    return element(by.xpath(".//*[contains(@class,'pficon.pficon-add-circle-o')]"));
  }

  clickCreateWorkitemIcon () {
    return this.createWorkItemIcon.click(); 
  }

  /* Codebases title */
  get codebasesTitle () {
    return element(by.xpath(".//span[contains(text(),'Codebases')]"));
  }

  get codebasesParent () {
    return element(by.xpath(".//span[contains(text(),'Codebases')]/../../.."));
  }

  get importCodebaseButton () {
    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains(@class,'btn-lg') and contains(text(),'Import a Codebase')]"))), constants.LONG_WAIT, 'Failed to find import codebase button');
    return element(by.xpath(".//*[contains(@class,'btn-lg') and contains(text(),'Import a Codebase')]"));
  }

  clickImportCodebaseButton () {
    return this.importCodebaseButton.click(); 
  }

  /* Pipelines title */
  get pipelinesTitle () {
    return element(by.xpath(".//span[contains(text(),'Pipelines')]"));
  }

   /* "Plan" in page heading */
  get headerPlan () {
    return element(by.xpath(".//*[contains(text(),'Plan')]"));
  }
  clickHeaderPlan () {
    browser.wait(until.elementToBeClickable(this.headerPlan), constants.LONG_WAIT, 'Failed to find element headerPlan');
    return this.headerPlan.click();
  }



  get wizardStepTitle () {
//     return element(by.css(".wizard-step-title"));
     return element(by.xpath(".//*[contains(@class,'wizard-step-title') and contains(text(),'Quickstart')]"));
  }

  get closeButton () {
     return this.wizardStepTitle.element(by.css(".pficon.pficon-close"));
  }
  clickCloseButton () {
     browser.wait(until.elementToBeClickable(this.closeButton), constants.WAIT, 'Failed to find CloseButton');
     return this.closeButton.click();
  }

  get cancelButton () {
    return wizardStepTitle.element(by.buttonText('Cancel'));
  }

  clickCancelButton () {
    browser.wait(until.elementToBeClickable(this.cancelButton), constants.LONG_WAIT, 'Failed to find Cancel Button');
    return this.cancelButton.click();
  }




  /* -----------------------------------------------------------------*/

  /* Codebase widget */

  get codeBaseWidget () {
    return element(by.xpath(".//*[contains(@class,'add-codebase-widget')]"));
  }

  /* Add to space button within Codebase widget */
  get codeBaseWidgetAddToSpaceButton () {
    return this.codeBaseWidget.element(by.buttonText('Add to Space'));
  }

  clickCodeBaseWidgetAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.codeBaseWidgetAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element headerPlan');
    return this.codeBaseWidgetAddToSpaceButton.click();
  }

  /* -----------------------------------------------------------------*/

  /* Pipelines widget */

  get pipelinesWidget () {
    return element(by.xpath(".//*[contains(@class,'pipelines-widget')]"));
  }

  /* Add to space button within Pipelines widget */
  get pipelinesWidgetAddToSpaceButton () {
    return this.pipelinesWidget.element(by.buttonText('Add to Space'));
  }

  clickPipelinesWidgetAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.pipelinesWidgetAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element pipelines');
    return this.pipelinesWidgetAddToSpaceButton.click();
  }


 /* -----------------------------------------------------------------*/

 /* Page overview */

  get analyzeOverview () {
    return element(by.id("analyze-overview"));
  }

  /* Add to space button within analyzeOverview */
  get analyzeOverviewAddToSpaceButton () {
    return this.analyzeOverview.element(by.buttonText('Add to Space'));
  }

  clickAnalyzeOverviewAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.analyzeOverviewAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element analyzeOverviewAddToSpaceButton');
    return this.analyzeOverviewAddToSpaceButton.click();
  }







  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
  }
  clickNoThanksButton () {
    browser.wait(until.elementToBeClickable(this.noThanksButton), constants.LONG_WAIT, 'Failed to find element noThanksButton button');
    return this.noThanksButton.click();
  }


/* 
Page layout as of April 24, 2017 - UI elements for Nav bar are in: openshift-io-dashboard.page.js, lower sections are page-specific.

|------------------------------------------------------------------------------------------------------------------------------|
|                                                    Top Navigation Bar                                                        |
| Left Navigation Bar            |                                                            | Right Navigation Bar           |
|                                |                                                            |                                | 
|------------------------------------------------------------------------------------------------------------------------------|
|                                       |                                                                                      |
|                                       |                                                                                      |
|          Codebases                    |                       Stack Reporrs                                                  |
|                                       |                                                                                      |
|                                       |                                                                                      |
|------------------------------------------------------------------------------------------------------------------------------|
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|          My Work Items                |             Pipelines                        |        Environments                   |
|                                       |                                              |                                       |
|                                       |                                              |                                       |
|------------------------------------------------------------------------------------------------------------------------------|
*/

/* UI Page Section: Analyze Overview (main body of page Bar */
/* UI Page Section: Codebases */
/* UI Page Section: Stack Reports */
/* UI Page Section: My Work Items */
/* UI Page Section: Pipelines */
/* UI Page Section: Environments */



  /* -----------------------------------------------------------------*/

  /* New project - 'how would you like to get started?' dialog */

//    .//h3/strong[contains (text(), 'Plan')]                Plan out my space
//    .//h3/strong[contains (text(), 'new code')]            Create new code from scratch 
//    .//h3/strong[contains (text(), 'code')]                Import existing code
//    .//h3/strong[contains (text(), 'technology stack')]    Select technology stack and pipeline

  get technologyStack () {
    return element(by.xpath(".//h3/strong[contains(text(),'technology stack')]"));
  }

  clickTechnologyStack () {
    return this.technologyStack.click();
  }

  get nextButton () {
    return element(by.buttonText('Next'));
  }

  clickNextButton () {
    browser.wait(until.elementToBeClickable(this.nextButton), constants.LONG_WAIT, 'Failed to find element next button');
    return this.nextButton.click();
  }

//    Launchpad: New Project
//    Label Booster
//    Label Project name
//    Label Top level package
//    Label Project version

//    Obsidian: Configure pipeline
//    Label Pipeline

//    io.fabric8.forge.generator.github.GithubRepoStep
//    Label Repository
//    Label Descriptiopn







}

module.exports = OpenShiftIoSpaceHomePage;



// UI ELement location strings:
//
//  Navigation Bar
//  .//*[contains(@class, 'navbar-collapse')]
//
//  Left Navigation Bar
//   .//*[contains(@class, 'navbar-left')]
//
//  User name in Left Navigation Bar
//   .//*[contains(@class, 'navbar-left')]//*[contains(text(), 'almusertest')]
//
//  Create space
//  .//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//*[contains(@class,'pficon-add-circle-o')]
//
//  View all spaces
//  .//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//i[contains(@class,'fa-th')]
//
//  Account home
//  .//*[contains(@class, 'navbar-left')]//*[contains(@class,'recent-items')]//*[contains(@class,'nav-item-icon')]//i[contains(@class,'pficon-home')]
// 
// Elements under Navigation Bar
//
// .//*[contains(@class, 'navbar-left')]//*[contains(@class, 'pficon-settings')]
// 
// .//*[contains(@class, 'navbar-left')]//*[contains(text(), 'Analyze')]
// 
// .//*[contains(@class, 'navbar-left')]//*[contains(text(), 'Plan')]
// 
// .//*[contains(@class, 'navbar-left')]//*[contains(text(), 'Create')]
// 
// Right Navigation Bar
// .//*[@id='header_rightDropdown']
// 
// Status Icon
// .//*[@id='header_rightDropdown']//*[contains(@class, 'status-dropdown')]
// 
// Status Values
// .//*[@id='header_rightDropdown']//*[contains(@class, 'list-group')][1]      Platform
// .//*[@id='header_rightDropdown']//*[contains(@class, 'list-group')][2]      Planner
// .//*[@id='header_rightDropdown']//*[contains(@class, 'list-group')][3]      Che
// .//*[@id='header_rightDropdown']//*[contains(@class, 'list-group')][4]      Pipeline
// 
// User Header Dropdown
// .//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]
// .//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Profile')]
// .//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Help')]
// .//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'About')]
// .//*[@id='header_rightDropdown']//*[contains(@class, 'user-dropdown-menu')]//*[contains(text(),'Log Out')]
// 
// UI Page Header - Edit Description and Add to Space Button
// .margin-top-15
// .//fabric8-edit-space-description-widget
// .//fabric8-edit-space-description-widget/../../div/button
// 
// Analyze section of UI page
// #analyze-overview
// 
// --------------------------
// 
// Codebases screen section
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]/../../..
// 
// Codebases section title/link
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]
// .//*[contains(@class,'card-pf-title')]/..//*[contains(text(), 'Create Codebase')]
// Button - Add Codebase
// Button - Import Codebase
// 
// --------------------------
// 
// Pipelines section title/link
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Pipelines')]
// 
// Pipelines section
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Pipelines')]/../../..
// .//*[@id='analyze-overview']/*/*/*/fabric8-pipelines-widget
// .col-md-4>fabric8-pipelines-widget
// .//fabric8-pipelines-widget
// 
// Button - Add to Space
// 
// --------------------------
// 
// My Workitems section title/link
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'My Work Items')]
// 
// My Workitems screen section
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'My Work Items')]/../../..
// .//*[@id='analyze-overview']/*/*/*/fabric8-create-work-item-widget
// .col-md-4>fabric8-create-work-item-widget
// .//fabric8-create-work-item-widget
// 
// Button - Create Workitem
// 
// --------------------------
// 
// Environments screen section title/link
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Environments')]
// 
// Environments screen section
// .//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Environments')]/../../..
// .//*[@id='analyze-overview']/*/*/*/fabric8-environment-widget
// .col-md-4>fabric8-environment-widget
// ./fabric8-environment-widget
// 
// --------------------------
// 
// Stack Reports screen title/link
// .//h2[contains(text(), 'Stack Reports')]
// 
// Stack Reports screen section
// .//h2[contains(text(), 'Stack Reports')]/../../..
// .//*[@id='analyze-overview']/*/*/*/fabric8-analytical-report-widget
// .//fabric8-analytical-report-widget
