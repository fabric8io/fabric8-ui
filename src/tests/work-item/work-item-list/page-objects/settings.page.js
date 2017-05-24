/**
 *
 * @author naverma@redhat.com
 * 
 */

'use strict';

/*
 * Code Page Definition - placeholder
 */

let testSupport = require('../testSupport');
let CommonPage = require('./common.page');
let constants = require("../constants");
let until = protractor.ExpectedConditions;

class SettingsPage {

 constructor(login) {
 };

 /** Settings Page Object modal */
 get profilePage (){
     return element(by.id("profile"));
 }
 
 get profileName (){
     return element(by.id("name"));
 }

 get profileEmail (){
     return element(by.id("email"));
 }

 get profileBio (){
     return element(by.id("bio"));
 }

 get profileURL (){
     return element(by.id("url"));
 }

 saveButton (){
     return element(by.css(".btn.btn-default"))
 }

}

module.exports = SettingsPage;
