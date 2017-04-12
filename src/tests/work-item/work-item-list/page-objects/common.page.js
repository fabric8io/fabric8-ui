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
let constants = require("../constants");
let HomePage = require('./home.page');
let CodePage = require('./code.page');
let TestPage = require('./test.page');
let PipelinePage = require('./pipeline.page');
let HypothesisPage = require('./hypothesis.page');
let SettingsPage = require('./settings.page');
let DashboardPage = require('./dashboard.page');
let NotificationsPage = require('./notifications.page');
let MicroservicesPage = require('./microservices.page');
let WorkItemListPage = require('./work-item-list.page');
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
}

module.exports = CommonPage;
