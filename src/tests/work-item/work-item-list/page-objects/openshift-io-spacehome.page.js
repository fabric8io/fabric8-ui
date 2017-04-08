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
      var xpathStr = "//h2[contains(text(),'" + spaceNameStr + "')]";
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

 


/*



Button with text
Create a Work Item




*/






  /* "Plan" in page heading */
  get headerPlan () {
    return element(by.xpath(".//*[contains(text(),'Plan')]"));
  }
  clickHeaderPlan () {
    browser.wait(until.elementToBeClickable(this.headerPlan), constants.LONG_WAIT, 'Failed to find element headerPlan');
    return this.headerPlan.click();
  }



}

module.exports = OpenShiftIoSpaceHomePage;
