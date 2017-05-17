/**
 *
 * @author naverma@redhat.com
 * 
 */

'use strict';

/*
 * Page Definition - placeholder
 */

let testSupport = require('../testSupport');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class SettingsPage {

 constructor(login) {
 };

 /** Settings Page Object modal */
 get resoucePage (){
     return element(by.linkText("Resource Usage"));
 }
 
}

module.exports = SettingsPage;
