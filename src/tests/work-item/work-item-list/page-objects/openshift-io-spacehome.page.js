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
      this.analyticalReportCombo.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: analyticalReportCombo");
    });
    return;
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
    this.createWorkitemButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: createWorkitemButton");
    });
    return; 
  }

  get createWorkItemIcon () {
    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains(@class,'pficon.pficon-add-circle-o')]"))), constants.LONG_WAIT, 'Failed to find create workitem icon');
    return element(by.xpath(".//*[contains(@class,'pficon.pficon-add-circle-o')]"));
  }

  clickCreateWorkitemIcon () {
    this.createWorkItemIcon.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: createWorkItemIcon");
    });
    return;
  }

  /* Codebases title */
  get codebasesTitle () {
    return element(by.xpath(".//span[contains(text(),'Codebases')]"));
  }

  get codebasesParent () {
    return element(by.xpath(".//span[contains(text(),'Codebases')]/../../.."));
  }

  get importCodebaseButton () {
    return element(by.xpath(".//button[contains(text(),'Import Codebase')]"));
  }
  clickImportCodebaseButton () {
    browser.wait(until.elementToBeClickable(this.importCodebaseButton), constants.LONG_WAIT, 'Failed to find element quickStartNextButton');
    this.importCodebaseButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: importCodebaseButton");
    });
    return;
  }

  /* Pipelines title */
  get pipelinesTitle () {
    return element(by.xpath(".//span[contains(text(),'Pipelines')]"));
  }

  /* -----------------------------------------------------------------*/

  /* Codebase widget */

  get codeBaseWidget () {
    return element(by.xpath(".//*[contains(@class,'add-codebase-widget')]"));
  }

  /* Add to space button within Codebase widget */
  get codeBaseWidgetAddToSpaceButton () {
    return this.codeBaseWidget.element(by.xpath(".//*[contains(text(),'Add to space')]"));                   //by.buttonText('Add to space'));
  }



  clickCodeBaseWidgetAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.codeBaseWidgetAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element headerPlan');
    this.codeBaseWidgetAddToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: codeBaseWidgetAddToSpaceButton");
    });
    return;
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
    this.pipelinesWidgetAddToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelinesWidgetAddToSpaceButton");
    });
    return;
  }

 /* -----------------------------------------------------------------*/

 /* Page overview */

  get analyzeOverview () {
    return element(by.id("analyze-overview"));
  }

  /* Add to space button within analyzeOverview */
  get analyzeOverviewAddToSpaceButton () {
    return this.analyzeOverview.element(by.buttonText('Add to space'));
  }

  clickAnalyzeOverviewAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.analyzeOverviewAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element analyzeOverviewAddToSpaceButton');
    this.analyzeOverviewAddToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: analyzeOverviewAddToSpaceButton");
    });
    return;
  }

  get primaryAddToSpaceButton () {
    return element(by.buttonText("Add to space"));   //xpath(".//button[contains(text(),'Add to space')]"));
  }
  clickPrimaryAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.primaryAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element primaryAddToSpaceButton button');
    this.primaryAddToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: addToSpaceButton");
    });
    return;
  }

  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
  }
  clickNoThanksButton () {
    browser.wait(until.elementToBeClickable(this.noThanksButton), constants.LONG_WAIT, 'Failed to find element noThanksButton button');
    this.noThanksButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: noThanksButton");
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

 /* Analyze/Plan/Create - Navigation bar elements unique to space home display */

  get headerAnalyze () {
    return element(by.xpath(".//*[contains(text(),'Analyze')]"));
  }
  clickHeaderAnalyze () {
    browser.wait(until.elementToBeClickable(this.headerAnalyze), constants.LONG_WAIT, 'Failed to find element headerAnalyze');
    this.headerPlan.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerAnalyze");
    });
    return;
  }

  get headerPlan () {
    return element(by.xpath(".//*[contains(text(),'Plan')]"));
  }
  clickHeaderPlan () {
    browser.wait(until.elementToBeClickable(this.headerPlan), constants.LONG_WAIT, 'Failed to find element headerPlan');
    this.headerPlan.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerPlan");
    });
    return;
  }

  get headerCreate () {
    return element(by.xpath(".//*[contains(text(),'Create')]"));
  }
  clickHeaderCreate () {
    browser.wait(until.elementToBeClickable(this.headerCreate), constants.LONG_WAIT, 'Failed to find element headerCreate');
    this.headerPlan.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerCreate");
    });
    return;
  }

  /* Dialog to create new project/add to space */
  get wizardStepTitle () {
//     return element(by.css(".wizard-step-title"));
     return element(by.xpath(".//*[contains(@class,'wizard-step-title') and contains(text(),'Quickstart')]"));
  }

  get closeButton () {
     return this.wizardStepTitle.element(by.css(".pficon.pficon-close"));
  }
  clickCloseButton () {
     browser.wait(until.elementToBeClickable(this.closeButton), constants.WAIT, 'Failed to find CloseButton');
     this.closeButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: closeButton");
    });
    return;
  }

  get cancelButton () {
    return wizardStepTitle.element(by.buttonText('Cancel'));
//return element(by.xpath("//*[contains(text(),'Technology Stack')]/../../../../../../footer/*/*/button[contains(text(),'Cancel')]"));
  }

  clickCancelButton () {
    browser.wait(until.elementToBeClickable(this.cancelButton), constants.LONG_WAIT, 'Failed to find Cancel Button');
    return this.cancelButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: cancelButton");
    });
    return;
  }

  /* Associate github repo in code base */
  get gitHubRepo () {
    return element(by.id("gitHubRepo"));
  }
  setGitHubRepo (newString) {
    browser.wait(until.elementToBeClickable(this.gitHubRepo), constants.LONG_WAIT, 'Failed to find gitHubRepo');
    return this.gitHubRepo.sendKeys(newString);
  }


 /* -----------------------------------------------------------------*/

 /* UI Page Section: Analyze Overview (main body of page Bar */

 /* UI Page Section: Codebases */

  get codebases () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]/../../.."));
  }
  clickCodebases () {
    browser.wait(until.elementToBeClickable(this.codebases), constants.LONG_WAIT, 'Failed to find element codebases');
    this.codebases.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: codebases");
    });
    return;
  }

  /* Codebases section title/link */

  get codebasesSectionTitle () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]"));
  }
  clickCodebasesSectionTitle () {
    browser.wait(until.elementToBeClickable(this.codebasesSectionTitle), constants.LONG_WAIT, 'Failed to find element codebasesSectionTitle');
    this.codebasesSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: codebasesSectionTitle");
    });
    return;
  }

  /* Codebases create code base link */

  get codebasesCreateLink () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]/..//*[contains(text(), 'Create Codebase')]"));
  }
  clickCodebasesCreateLink () {
    browser.wait(until.elementToBeClickable(this.codebasesCreateLink), constants.LONG_WAIT, 'Failed to find element codebasesCreateLink');
    this.codebasesCreateLink.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: codebasesCreateLink");
    });
    return;
  }

  get addCodebaseButton () {
    return codebases.element(by.buttonText('Add Codebase'));
  }

  clickAddCodebaseButton () {
    browser.wait(until.elementToBeClickable(this.addCodebaseButton), constants.LONG_WAIT, 'Failed to find addCodebaseButton Button');
    return this.addCodebaseButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: addCodebaseButton");
    });
    return;
  }

  get importCodebaseButton () {
    return this.codebases.element(by.buttonText('Import Codebase'));
  }

  clickImportCodebaseButton () {
    browser.wait(until.elementToBeClickable(this.importCodebaseButton), constants.LONG_WAIT, 'Failed to find importCodebaseButton Button');
    return this.importCodebaseButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: importCodebaseButton");
    });
    return;
  }

/* UI Page Section: Stack Reports */

  get stackReports () {
    return element(by.xpath(".//fabric8-analytical-report-widget"));
  }
  clickStackReports () {
    browser.wait(until.elementToBeClickable(this.stackReports), constants.LONG_WAIT, 'Failed to find element stackReports');
    this.stackReports.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: stackReports");
    });
    return;
  }

  /* STack Reports */
  get stackReportsSectionTitle () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Stack Reports')]"));
  }
  clickStackReportsSectionTitle () {
    browser.wait(until.elementToBeClickable(this.stackReportsSectionTitle), constants.LONG_WAIT, 'Failed to find element stackReportsSectionTitle');
    this.stackReportsSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: SectionTitle");
    });
    return;
  }

/* UI Page Section: My Workitems */

  get workitems () {
    return element(by.xpath(".//fabric8-create-work-item-widget"));
  }
  clickworkitems () {
    browser.wait(until.elementToBeClickable(this.workitems), constants.LONG_WAIT, 'Failed to find element workitems');
    this.workitems.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: workitems");
    });
    return;
  }

  /* My Workitems section title/link */
  get workitemsSectionTitle () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'My WorkItems')]"));
  }
  clickWorkitemsSectionTitle () {
    browser.wait(until.elementToBeClickable(this.workitemsSectionTitle), constants.LONG_WAIT, 'Failed to find element workitemsSectionTitle');
    this.workitemsSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: workitemsSectionTitle");
    });
    return;
  }

  get createWorkitemButton () {
    return pipelines.element(by.buttonText('Create workitem'));
  }

  clickCreateWorkitemButton () {
    browser.wait(until.elementToBeClickable(this.createWorkitemButton), constants.LONG_WAIT, 'Failed to find createWorkitemButton Button');
    return this.createWorkitemButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: createWorkitemButton");
    });
    return;
  }

/* UI Page Section: Pipelines */

  get pipelines () {
    return element(by.xpath(".//fabric8-pipelines-widget"));
  }
  clickPipelines () {
    browser.wait(until.elementToBeClickable(this.pipelines), constants.LONG_WAIT, 'Failed to find element pipelines');
    this.codebases.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelines");
    });
    return;
  }

  /* Pipelines section title/link */
  get pipelinesSectionTitle () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Pipelines')]"));
  }
  clickPipelinesSectionTitle () {
    browser.wait(until.elementToBeClickable(this.pipelinesSectionTitle), constants.LONG_WAIT, 'Failed to find element pipelinesSectionTitle');
    this.pipelinesSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelinesSectionTitle");
    });
    return;
  }

  get addToSpaceButton () {
    return this.pipelines.element(by.buttonText('Add to space'));
  }

  clickAddToSpaceButton2 () {
    browser.wait(until.elementToBeClickable(this.addToSpaceButton), constants.LONG_WAIT, 'Failed to find addToSpaceButton Button');
    return this.addToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: addToSpaceButton");
    });
    return;
  }

/* UI Page Section: Environments */

  get environments () {
    return element(by.xpath(".//fabric8-environment-widget"));
  }
  clickEnvironments  () {
    browser.wait(until.elementToBeClickable(this.environments), constants.LONG_WAIT, 'Failed to find element environments');
    this.codebases.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: environments");
    });
    return;
  }

  /* Environments section title/link */
  get environmentsSectionTitle () {
    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Environments')]"));
  }
  clickEnvironmentsSectionTitle () {
    browser.wait(until.elementToBeClickable(this.environmentsSectionTitle), constants.LONG_WAIT, 'Failed to find element environmentsSectionTitle');
    this.environmentsSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: environmentsSectionTitle");
    });
    return;
  }

  /* -----------------------------------------------------------------*/

  /* New project - 'how would you like to get started?' dialog */

//    .//h3/strong[contains (text(), 'Plan')]                Plan out my space
//    .//h3/strong[contains (text(), 'new code')]            Create new code from scratch 
//    .//h3/strong[contains (text(), 'code')]                Import existing code
//    .//h3/strong[contains (text(), 'technology stack')]    Select technology stack and pipeline

  /* Quickstart - Select technology stack and pipeline */

  get quickStartCancelButton () {
    return element(by.xpath("//*[contains(text(), 'Quickstart')]/../../../../..//button[contains(text(),'Cancel')]"));
  }
  clickQuickStartCancelButton () {
    browser.wait(until.elementToBeClickable(this.quickStartCancelButton), constants.LONG_WAIT, 'Failed to find element quickStartCancelButton');
    this.quickStartCancelButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: quickStartCancelButton");
    });
    return;
  }

  get quickStartNextButton () {
    return element(by.xpath("//*[contains(text(), 'Quickstart')]/../../../../..//button[contains(text(),'Next')]"));
  }
  clickQuickStartNextButton () {
    browser.wait(until.elementToBeClickable(this.quickStartNextButton), constants.LONG_WAIT, 'Failed to find element quickStartNextButton');
    this.quickStartNextButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: quickStartNextButton");
    });
    return;
  }

  get quickStartFinishButton () {
    return element(by.xpath("//*[contains(text(), 'Quickstart')]/../../../../..//button[contains(text(),'Finish')]"));
  }
  clickQuickStartFinishButton () {
      browser.wait(until.elementToBeClickable(this.quickStartFinishButton), constants.LONG_WAIT, 'Failed to find element quickStartFinishButton');
      this.quickStartFinishButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: quickStartFinishButton");
    });
    return;
  }

  get technologyStack () {
    return element(by.xpath(".//h3/strong[contains(text(),'technology stack')]"));
  }

  clickTechnologyStack () {
    this.technologyStack.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: technologyStack");
    });
    return;
  }

  get okButton () {
    return element(by.xpath(".//*[contains(text(), 'OK')]"));
  }

  clickOkButton () {
     browser.wait(until.elementToBeClickable(this.okButton), constants.LONG_WAIT, 'Failed to find element OK button');
     this.okButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: okButton");
    });
    return;
  }

  get syncButton () {
    return element(by.xpath(".//*[contains(text(), 'Sync')]"));
  }

  clickSyncButton () {
     browser.wait(until.elementToBeClickable(this.syncButton), constants.LONG_WAIT, 'Failed to find element Sync button');
     this.syncButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: syncButton");
    });
    return;
  }

  get associateRepoButton () {
    return element(by.xpath(".//*[contains(text(), 'Associate Repository to Space')]"));
  }

  clickAssociateRepoButton () {
     browser.wait(until.elementToBeClickable(this.associateRepoButton), constants.LONG_WAIT, 'Failed to find element associateRepo button');
     this.associateRepoButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: associateRepoButton");
    });
    return;
  }





  /* Technology Stack project types */

  get vertXbasic () {
    return element(by.xpath("Vert.x - Basic"));
  }
  clickVertXbasic () {
    this.vertXbasic.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: vertXbasic");
    });
    return;
  }

 get vertXcrud () {
    return element(by.xpath("Vert.x - CRUD"));
 }
  clickVertXcrud () {
    this.vertXcrud.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: vertXcrud");
    });
    return;
  }

 get vertXconfigmap () {
    return element(by.xpath("Vert.x - ConfigMap"));
 }
  clickVertXconfigmap () {
    this.vertXconfigmap.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: vertXconfigmap");
    });
    return;
  }

  get nextButton () {
    return element(by.buttonText('Next'));
  }

  clickNextButton () {
    browser.wait(until.elementToBeClickable(this.nextButton), constants.LONG_WAIT, 'Failed to find element next button');
    this.nextButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: nextButton");
    });
    return;
  }

}

module.exports = OpenShiftIoSpaceHomePage;

// UI ELement location strings - TODO - create element IDs for these UI elements
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
