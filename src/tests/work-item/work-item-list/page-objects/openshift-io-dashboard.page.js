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

  get wizardStepTitle () {
    return element(by.css(".wizard-step-title"));
  }
  get cancelXButton () {
    return this.wizardStepTitle.element(by.css(".glyphicon.glyphicon-remove"));
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


}

module.exports = OpenShiftIoDashboardPage;
