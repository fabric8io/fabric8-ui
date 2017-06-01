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

  /* On the pipeline page */

  /* The list of pipelines for the space */
  get pipelinesPage () {
    browser.wait(until.elementToBeClickable(element(by.xpath(".//*[contains (@class,'pipelines-page')]"))), constants.LONG_WAIT, 'Failed to find element pipelineByName');
    return element(by.xpath(".//*[contains (@class,'pipelines-page')]"));
  }

  /* Assume only one pipeline since this is a new space */
//    .//contains[(@class,'pficon-build')][1]

  pipelineByName (pipelineNameString) {
    var xpathString = ".//*[contains(text(),'almightytest/" + pipelineNameString + "')]";
    return element(by.xpath(xpathString));
  }
  clickpipelineByName (pipelineNameString) {
    browser.wait(until.elementToBeClickable(this.pipelineByName (pipelineNameString)), constants.LONG_WAIT, 'Failed to find element pipelineByName');
    this.pipelineByName(pipelineNameString).click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelineByName");
    });
    return;
  }

  pipelineByNameBuildIcon (pipelineNameString) {
    var xpathString = ".//*[contains(text(),'almightytest/" + pipelineNameString + "')]/../../../div/codebases-item-workspaces";
    return element(by.xpath(xpathString));
  }
  clickpipelineByNameBuildIcon (pipelineNameString) {
    browser.wait(until.elementToBeClickable(this.pipelineByNameBuildIcon (pipelineNameString)), constants.LONG_WAIT, 'Failed to find element pipelineByNameBuildIcon');
    this.pipelineByNameBuildIcon(pipelineNameString).click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelineByNameBuildIcon");
    });
    return;
  }

  get firstPipeline () {
    return element(by.xpath(".//codebases-item-workspaces[1]"));
  }
  clickFirstPipeline () {
    browser.wait(until.elementToBeClickable(this.firstPipeline), constants.LONG_WAIT, 'Failed to find element firstPipeline');
    this.firstPipeline.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: firstPipeline");
    });
    return;
  }

 /* -----------------------------------------------------------------*/

 /* Page overview */

  get analyzeOverview () {
    return element(by.id("analyze-overview"));
  }

  get primaryAddToSpaceButton () {
    //return element(by.buttonText("Add to space"));   //xpath(".//button[contains(text(),'Add to space')]"));
    return element(by.id("analyze-overview-add-to-space-button"));
  }
  clickPrimaryAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.primaryAddToSpaceButton), constants.LONG_WAIT, 'Failed to find element primaryAddToSpaceButton button');
    this.primaryAddToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: addToSpaceButton");
    });
    return;
  }

  get noThanksButton () {
//    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
    return element(by.id("noThanksButton"));
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
    this.headerAnalyze.click().then(function(){
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]/../../.."));
    return element(by.id("spacehome-codebases-card"));
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Codebases')]"));
    return element(by.id("spacehome-codebases-title"));
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
//    return element(by.xpath(".//fabric8-analytical-report-widget"));
  return element(by.id("spacehome-analytical-report-card"));
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Stack Reports')]"));
    return element(by.id("spacehome-analytical-report-title"));
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
//    return element(by.xpath(".//fabric8-create-work-item-widget"));
  return element(by.id("spacehome-my-workitems-card"));
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'My WorkItems')]"));
    return element(by.id("spacehome-my-workitems-title"));
  }
  clickWorkitemsSectionTitle () {
    browser.wait(until.elementToBeClickable(this.workitemsSectionTitle), constants.LONG_WAIT, 'Failed to find element workitemsSectionTitle');
    this.workitemsSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: workitemsSectionTitle");
    });
    return;
  }

  get createWorkitemButton () {
//    return pipelines.element(by.buttonText('Create workitem'));
    return element(by.id("spacehome-my-workitems-create-button"));
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
//    return element(by.xpath(".//fabric8-pipelines-widget"));
    return element(by.id("spacehome-pipelines-card"));
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Pipelines')]"));
    return element(by.id("spacehome-pipelines-title"));
  }
  clickPipelinesSectionTitle () {
    browser.wait(until.elementToBeClickable(this.pipelinesSectionTitle), constants.LONG_WAIT, 'Failed to find element pipelinesSectionTitle');
    this.pipelinesSectionTitle.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelinesSectionTitle");
    });
    return;
  }

  get addToSpaceButton () {
//    return this.pipelines.element(by.buttonText('Add to space'));
  return element(by.id("spacehome-pipelines-add-button"));
  }

  clickAddToSpaceButton () {
    browser.wait(until.elementToBeClickable(this.addToSpaceButton), constants.LONG_WAIT, 'Failed to find addToSpaceButton Button');
    return this.addToSpaceButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: addToSpaceButton");
    });
    return;
  }

/* UI Page Section: Environments */

  get environments () {
//    return element(by.xpath(".//fabric8-environment-widget"));
    return element(by.id("spacehome-environments-card"));
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
//    return element(by.xpath(".//*[contains(@class,'card-pf-title')]//*[contains(text(), 'Environments')]"));
    return element(by.id("spacehome-environments-title"));
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
//    return element(by.xpath("//*[contains(text(), 'Quickstart')]/../../../../..//button[contains(text(),'Cancel')]"));
    return element(by.id("forge-cancel-button"));
  }
  clickQuickStartCancelButton () {
    browser.wait(until.elementToBeClickable(this.quickStartCancelButton), constants.LONG_WAIT, 'Failed to find element quickStartCancelButton');
    this.quickStartCancelButton.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: quickStartCancelButton");
    });
    return;
  }

  get quickStartNextButton () {
//    return element(by.xpath("//*[contains(text(), 'Quickstart')]/../../../../..//button[contains(text(),'Next')]"));
    return element(by.id("forge-next-button"));
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

  /* -----------------------------------------------------------------*/

  /* The "Create" subpage of the space home page */
  
  get headerCreate () {
    return element(by.xpath(".//*[contains(text(),'Create')]"));
  }
  clickHeaderCreate () {
    browser.wait(until.elementToBeClickable(this.headerCreate), constants.LONG_WAIT, 'Failed to find element headerCreate');
    this.headerCreate.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerCreate");
    });
    return;
  }

  /* Codebases tab under Create */

  get headerCodebases () {
    return element(by.xpath(".//*[contains(text(),'Codebases')]"));
  }
  clickHeaderCodebases () {
    browser.wait(until.elementToBeClickable(this.headerCodebases), constants.LONG_WAIT, 'Failed to find element headerCodebases');
    this.headerCodebases.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerCodebases");
    });
    return;
  }

  /* Pipelines tab under Create */

  get headerPipelines () {
    return element(by.xpath(".//span[contains(text(),'Pipelines')]"));
  }
  clickHeaderPipelines () {
    browser.wait(until.elementToBeClickable(this.headerPipelines), constants.LONG_WAIT, 'Failed to find element headerPipelines');
    this.headerPipelines.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: headerPipelines");
    });
    return;
  }

  /* Access a codebase by name */

//  pipelineByName (pipelineNameString) {
//  //     .//*[contains(text(),'testMay81494273390587')]/../../../div-item-workspaces
//    var xpathString = ".//*[contains(text(),'" + pipelineNameString + "')]/../../../div-item-workspaces";
//    return element(by.xpath(xpathString));
//  }
//  clickpipelineByName (pipelineNameString) {
//    browser.wait(until.elementToBeClickable(this.pipelineByName (pipelineNameString)), constants.LONG_WAIT, 'Failed to find element pipelineByName');
//    this.pipelineByName(pipelineNameString).click().then(function(){
//      console.log("OpenShiftIoSpaceHomePage - clicked element: pipelineByName");
//    });
//    return;
//  }

  get createWorkspace () {
    return element(by.xpath(".//codebases-item-workspaces[1]"));
  }
  clickCreateWorkspace () {
    browser.wait(until.elementToBeClickable(this.createWorkspace), constants.LONG_WAIT, 'Failed to find element createWorkspace');
    this.createWorkspace.click().then(function(){
      console.log("OpenShiftIoSpaceHomePage - clicked element: createWorkspace");
    });
    return;
  }

}

module.exports = OpenShiftIoSpaceHomePage;
