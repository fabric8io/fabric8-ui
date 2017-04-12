/**
 * AlMighty page object example module for openshift.io start page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 */

'use strict';

/*
 * openshift.io "Additional Action Required" page Definition
 */

var testSupport = require('../testSupport'),
    constants = require("../constants"),
    OpenShiftIoDashboardPage = require('./openshift-io-dashboard.page');

var until = protractor.ExpectedConditions;

  const devProcesses  = {
    Agile: 0,
    Scrum: 1,
    IssueTracking: 2,
    ScenarioDrivenPlanning: 3
  }

class OpenShiftIoRegistrationPage {

  constructor() {
  };

  /* Email field */

  get emailField () {
    return element(by.id("email"));
  }

  clickEmailField () {
    browser.wait(until.elementToBeClickable(this.emailField), constants.LONG_WAIT, 'Failed to find element emailField');
    return this.emailField.click();
  }

  typeEmailField (emailString) {
    browser.wait(until.elementToBeClickable(this.emailField), constants.LONG_WAIT, 'Failed to find element emailField');
    return this.emailField.sendKeys(emailString);
  }

  /* First name field */

  get firstNameField () {
    return element(by.id("firstName"));
  }

  clickfirstNameField () {
    browser.wait(until.elementToBeClickable(this.firstNameField), constants.LONG_WAIT, 'Failed to find element firstNameField');
    return this.firstNameField.click();
  }

  typefirstNameField (firstNameString) {
    browser.wait(until.elementToBeClickable(this.firstNameField), constants.LONG_WAIT, 'Failed to find element firstNameField');
    return this.firstNameField.sendKeys(firstNameString);
  }

  /* First last field */

  get lastNameField () {
    return element(by.id("lastName"));
  }

  clicklastNameField () {
    browser.wait(until.elementToBeClickable(this.lastNameField), constants.LONG_WAIT, 'Failed to find element lastNameField');
    return this.lastNameField.click();
  }

  typelastNameField (lastNameString) {
    browser.wait(until.elementToBeClickable(this.lastNameField), constants.LONG_WAIT, 'Failed to find element lastNameField');
    return this.lastNameField.sendKeys(lastNameString);
  }

  /* Company field */

  get companyField () {
    return element(by.id("user.attributes.company"));
  }

  clickCompanyField () {
    browser.wait(until.elementToBeClickable(this.companyField), constants.LONG_WAIT, 'Failed to find element companyField');
    return this.companyField.click();
  }

  typeCompanyField (companyString) {
    browser.wait(until.elementToBeClickable(this.companyField), constants.LONG_WAIT, 'Failed to find element companyField');
    return this.companyField.sendKeys(companyString);
  }

  /* Phone number field */

  get phoneNumberField () {
    return element(by.id("user.attributes.phoneNumber"));
  }

  clickPhoneNumberField () {
    browser.wait(until.elementToBeClickable(this.phoneNumberField), constants.LONG_WAIT, 'Failed to find element phoneNumberField');
    return this.phoneNumberField.click();
  }

  typePhoneNumberField (phoneNumberString) {
    browser.wait(until.elementToBeClickable(this.phoneNumberField), constants.LONG_WAIT, 'Failed to find element phoneNumberField');
    return this.phoneNumberField.sendKeys(phoneNumberString);
  }

  /* Country field */

  get countryField () {
    return element(by.id("user.attributes.country"));
  }

  clickCountryField () {
    browser.wait(until.elementToBeClickable(this.countryField), constants.LONG_WAIT, 'Failed to find element countryField');
    return this.countryField.click();
  }

  typeCountryField (countryString) {
    browser.wait(until.elementToBeClickable(this.countryField), constants.LONG_WAIT, 'Failed to find element countryField');
    return this.countryField.sendKeys(countryString);
  }

  /* Address Line 1 field */

  get addressLine1Field () {
    return element(by.id("user.attributes.addressLine1"));
  }

  clickAddressLine1Field () {
    browser.wait(until.elementToBeClickable(this.addressLine1Field), constants.LONG_WAIT, 'Failed to find element addressLine1');
    return this.addressLine1Field.click();
  }

  typeAddressLine1Field (addressLine1String) {
    browser.wait(until.elementToBeClickable(this.addressLine1Field), constants.LONG_WAIT, 'Failed to find element addressLine1');
    return this.addressLine1Field.sendKeys(addressLine1String);
  }

  /* Address City field */

  get addressCityField () {
    return element(by.id("user.attributes.addressCity"));
  }

  clickAddressCityField () {
    browser.wait(until.elementToBeClickable(this.addressCityField), constants.LONG_WAIT, 'Failed to find element addressCity');
    return this.addressCityField.click();
  }

  typeAddressCityField (addressCityString) {
    browser.wait(until.elementToBeClickable(this.addressCityField), constants.LONG_WAIT, 'Failed to find element addressCity');
    return this.addressCityField.sendKeys(addressCityString);
  }

  /* Address State field */

  get addressStateField () {
    return element(by.id("user.attributes.addressStateText"));
  }

  clickAddressStateField () {
    browser.wait(until.elementToBeClickable(this.addressStateField), constants.LONG_WAIT, 'Failed to find element addressState');
    return this.addressStateField.click();
  }

  typeAddressStateField (addressStateString) {
    browser.wait(until.elementToBeClickable(this.addressStateField), constants.LONG_WAIT, 'Failed to find element addressState');
    return this.addressStateField.sendKeys(addressStateString);
  }

  /* Address Postal Code field */

  get addressPostalCodeField () {
    return element(by.id("user.attributes.addressPostalCode"));
  }

  clickAddressPostalCodeField () {
    browser.wait(until.elementToBeClickable(this.addressPostalCodeField), constants.LONG_WAIT, 'Failed to find element addressPostalCode');
    return this.addressPostalCodeField.click();
  }

  typeAddressPostalCodeField (addressPostalCodeString) {
    browser.wait(until.elementToBeClickable(this.addressPostalCodeField), constants.LONG_WAIT, 'Failed to find element addressPostalCode');
    return this.addressPostalCodeField.sendKeys(addressPostalCodeString);
  }

  /* Accept terms checkbox */

  get termsCheckBox () {
    return element(by.id("user.attributes.tcacc-1147"));
  }

  clickTermsCheckBox () {
    browser.wait(until.elementToBeClickable(this.termsCheckBox), constants.LONG_WAIT, 'Failed to find element termsCheckBox');
    return this.termsCheckBox.click();
  }

  /* Newsletter checkbox */

  get newsletterCheckBox () {
    return element(by.id("user.attributes.newsletter"));
  }

  clickNewsletterCheckBox () {
    browser.wait(until.elementToBeClickable(this.newsletterCheckBox), constants.LONG_WAIT, 'Failed to find element Newsletter');
    return this.newsletterCheckBox.click();
  }

  /* OpenShift Online Newsletter checkbox */

  get openShiftOnlineNewsletterCheckBox () {
    return element(by.id("user.attributes.newsletterOpenShiftOnline"));
  }

  clickOpenShiftOnlineNewsletterCheckBox () {
    browser.wait(until.elementToBeClickable(this.openShiftOnlineNewsletterCheckBox), constants.LONG_WAIT, 'Failed to find element openShiftOnlineCheckBox');
    return this.openShiftOnlineNewsletterCheckBox.click();
  }

  /* Submit button */

  get submitButton () {
    return element(by.css('.button'));
  }

  clickSubmitButton () {
    browser.wait(until.elementToBeClickable(this.submitButton), constants.LONG_WAIT, 'Failed to find element submitButton');
    this.submitButton.click();
    return new OpenShiftIoDashboardPage();
  }

}

module.exports = OpenShiftIoRegistrationPage;
