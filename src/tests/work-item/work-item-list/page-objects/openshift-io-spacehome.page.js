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

  /* -----------------------------------------------------------------*/

  /* Codebase widget */

  get codeBaseWidget () {
    return element(by.xpath(".//*[contains(@class,'add-codebase-widget')]"));
  }

  /* Add to space button within Codebase widget */
  get codeBaseWidgetAddToSpaceButton () {
    return this.codeBaseWidget.element(by.buttonText('Add to space'));
  }

  clickCodeBaseWidgetAddToSpaceButton () {
    return this.codeBaseWidgetAddToSpaceButton.click();
  }

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







  get noThanksButton () {
    return element(by.xpath(".//a[contains(text(),'No thanks, take me to')]"));
  }
  clickNoThanksButton () {
    return this.noThanksButton.click();
  }





}

module.exports = OpenShiftIoSpaceHomePage;
