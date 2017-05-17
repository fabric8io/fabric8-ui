/**
 * AlMighty page object example module for work item list page
 * See: http://martinfowler.com/bliki/PageObject.html,
 * https://www.thoughtworks.com/insights/blog/using-page-objects-overcome-protractors-shortcomings
 * @author ldimaggi@redhat.com
 * TODO - Complete the page object model pending completion of UI at: http://demo.almighty.io/
 */

'use strict';

/*
 * Common Page Definition - Elements common to all pages
 */

let testSupport = require('../testSupport');
let Settings = require('../page-objects/settings.page');
let until = protractor.ExpectedConditions;
let waitTime = 30000;

class CommonPage {

 constructor() {
 };

/* Page elements - top of the page */

  /* Work (workitems) page */
 clickDashboardMenuTab () {
    return element(by.id("header_menuHome")).click();
  }

/* Hypothesis page */
 clickHypothesisMenuTab () {
    return element(by.id("header_menuHypothesis")).click();
  }
/* Notifications page */
 clickNotificationsMenuTab () {
    return element(by.id("header_menuNotifications")).click();
  }
  /* Pipeline page */
 clickPipelineMenuTab () {
    return element(by.id("header_menuPipeline")).click();
  }
/* Settings page */
 clickSettingsMenuTab () {
    return element(by.id("header_menuSettings")).click();
  }
  /* Test page */
 clickTestMenuTab () {
    return element(by.id("header_menuTest")).click(); 
  }

  /*URLs POM Owning entity*/

 //entity's profile/settings
 settingsUrl (baseUrl,username){
   browser.get(baseUrl + username + "/_settings");
 }

//Spaces associated with the entity
 spacesUrl (baseUrl,username){
   browser.get(baseUrl + username + "/_spaces");
 }

//Resources associated with the entity
 resourcesUrl (baseUrl,username){
   browser.get(baseUrl + username + "/_resources");
 }

//Email prefs for user
 emailUrl (baseUrl,username){
   browser.get(baseUrl + username + "/_settings/emails");
 }

//Notification prefs for user
 notificationsUrl (baseUrl,username){
   browser.get(baseUrl + username + "/_settings/notifications");
 }
 
 //Dashboard for this space
 spaceDashboard (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename);
 }

 /**Planner  URLs */
 
 //List/tree view of all work-items
 workitemslistPlan (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/plan/workitems");
 }

//Detail view of work item with id 42
 workitemWithId (baseUrl,username,spacename,id){
   browser.get(baseUrl + username + "/" + spacename +"/plan/workitems/" +id);
 }
 
 //view for work items matching the query within this space
 workitemQueryUrl (baseUrl,username,spacename,query){
   browser.get(baseUrl + username + "/" + spacename +"/plan/workitems/?q=" +query);
 }
 
 /**Planner Board URLs */

//Backlog view for all work items in this space
 boardItemViewUrl (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/plan/boards");
 }

//Backlog view for work items matching the query within this space
 boardItemQueryUrl (baseUrl,username,spacename,query){
   browser.get(baseUrl + username + "/" + spacename +"/plan/boards/q=" + query);
 }

 /**Team URLs */

//Dashboard/overview of all teams in fabric8 space
 viewAllTeamInSpace (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/teams");
 }

//Team view for the 'planner' team
 TeamViewInSpace (baseUrl,username,spacename,teamname){
   browser.get(baseUrl + username + "/" + spacename +"/teams/" + teamname);
 }

 /**Iteration URLs */

//Overview of all iterations
 viewAllIterations (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/iterations");
 }

 //dashboard for workitems with in iteration and its children
 viewIteration (baseUrl,username,spacename,iterationname){
   browser.get(baseUrl + username + "/" + spacename +"/iterations/" + iterationname);
 }

 //dashboard for workitems with in iteration and its children
 viewchildIteration (baseUrl,username,spacename,iterationname,children){
   browser.get(baseUrl + username + "/" + spacename +"/iterations/" + iterationname +"/" +children);
 }
 
 /**Area URLs */

//Overview of all area
 viewAllAreas (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/areas");
 }

//dashboard for workitems within area and its children
 viewArea (baseUrl,username,spacename,area){
   browser.get(baseUrl + username + "/" + spacename +"/areas/" + area);
 }

//dashboard for workitems within ui and its children
 viewNestedArea (baseUrl,username,spacename,area,child,query){
   browser.get(baseUrl + username + "/" + spacename +"/areas/" + area + "/" + child + "/q=" +query);
 }

 /** Codebase URLs */

 viewCodeBase (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/codebases");
 } 

 /**Workspace URLs */

 viewWorkspaces (baseUrl,username,spacename){
   browser.get(baseUrl + username + "/" + spacename +"/workspaces");
 }
 
}

module.exports = CommonPage;
