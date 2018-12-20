import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';

describe('Agile template tests: ', () => {
  let plannerAgile: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    plannerAgile = new PlannerPage(browser.baseUrl);
    plannerAgile.openInBrowser();
    await plannerAgile.waitUntilUrlContains('typegroup.name');
  });

  beforeEach(async () => {
    await plannerAgile.ready();
    await plannerAgile.workItemList.overlay.untilHidden();
  });

  it('should have workitem types', async () => {
    let wiTypes = await plannerAgile.quickAdd.workItemTypes();
    expect(wiTypes.length).toBe(6);
    expect(wiTypes[0]).toBe('Theme');
    expect(wiTypes[1]).toBe('Epic');
    expect(wiTypes[2]).toBe('Story');
    expect(wiTypes[3]).toBe('Task');
    expect(wiTypes[4]).toBe('Defect');
    expect(wiTypes[5]).toBe('Impediment');
    await plannerAgile.quickAdd.workItemTypeDropdown.clickWhenReady();
  });

  it('should create a workitem of type defect and update Effort', async () => {
    let newWorkItem = { title: 'Workitem of type Defect', type: 'Defect' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    /* Update Effort */
    await plannerAgile.workItemList.clickWorkItem(newWorkItem.title);
    await plannerAgile.quickPreview.updateEffort('3');
    await plannerAgile.quickPreview.effortTextArea.untilTextIsPresentInValue('3');
    expect(await plannerAgile.quickPreview.effortTextArea.getAttribute('value')).toBe('3');
    await plannerAgile.quickPreview.close();
  });

  it('should create a workitem of type Theme and update Business value', async () => {
    let newWorkItem = { title: 'Workitem of type Theme', type: 'Theme' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    /* Update Business Value */
    await plannerAgile.workItemList.clickWorkItem(newWorkItem.title);
    await plannerAgile.quickPreview.updateBusinessValue('Business value for this Theme');
    await plannerAgile.quickPreview.businessValue.untilTextIsPresentInValue(
      'Business value for this Theme',
    );
    expect(await plannerAgile.quickPreview.businessValue.getAttribute('value')).toBe(
      'Business value for this Theme',
    );
    await plannerAgile.quickPreview.close();
  });

  it('Dynamic fields should not get closed on outside click if the field value is changed', async () => {
    let newWorkItem = { title: 'Workitem of type Story', type: 'Story' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    /* Edit Story Points */
    await plannerAgile.workItemList.clickWorkItem(newWorkItem.title);
    await plannerAgile.quickPreview.storyPoints.clickWhenReady();
    expect(await plannerAgile.quickPreview.isDynamicFieldSaveButtonDisplayed()).toBeTruthy();
    await plannerAgile.quickPreview.storyPoints.enterText('8');
    await plannerAgile.quickPreview.labelDropdown.clickWhenReady();
    expect(await plannerAgile.quickPreview.isDynamicFieldSaveButtonDisplayed()).toBeTruthy();
    await plannerAgile.quickPreview.close();
  });

  it('should create a workitem of type THEME and check for the order of child types in dropdown', async () => {
    let newWorkItem = { title: 'Theme 1', type: 'Theme' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    // open the inline quick add for newly created WorkItem
    await plannerAgile.workItemList.workItem(newWorkItem.title).clickInlineQuickAdd();
    // get the workItem types for inline quick add
    let wiTypes = await plannerAgile.inlineQuickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes[0]).toBe('Epic');
    expect(wiTypes[1]).toBe('Defect');
    expect(wiTypes[2]).toBe('Impediment');
  });

  it('should create a workitem of type EPIC and check for the order of child types in dropdown', async () => {
    let newWorkItem = { title: 'Epic 1', type: 'Epic' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    // open the inline quick add for newly created WorkItem
    await plannerAgile.workItemList.workItem(newWorkItem.title).clickInlineQuickAdd();
    // get the workItem types for inline quick add
    let wiTypes = await plannerAgile.inlineQuickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes[0]).toBe('Story');
    expect(wiTypes[1]).toBe('Defect');
    expect(wiTypes[2]).toBe('Impediment');
  });

  it('should create a workitem of type STORY and check for the order of child types in dropdown', async () => {
    let newWorkItem = { title: 'Story 1', type: 'Story' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    // open the inline quick add for newly created WorkItem
    await plannerAgile.workItemList.workItem(newWorkItem.title).clickInlineQuickAdd();
    // get the workItem types for inline quick add
    let wiTypes = await plannerAgile.inlineQuickAdd.workItemTypes();
    expect(wiTypes.length).toBe(3);
    expect(wiTypes[0]).toBe('Task');
    expect(wiTypes[1]).toBe('Defect');
    expect(wiTypes[2]).toBe('Impediment');
  });

  it('by default Closed work item should not show in list', async () => {
    let newWorkItem = { title: 'Closed work item test', type: 'Theme' };
    await plannerAgile.createWorkItem(newWorkItem);
    expect(plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    await plannerAgile.workItemList.clickWorkItem(newWorkItem.title);
    await plannerAgile.quickPreview.changeStateTo('Closed');
    await plannerAgile.quickPreview.close();
    await plannerAgile.header.clickShowCompleted();
    expect(await plannerAgile.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    await plannerAgile.header.clickShowCompleted();
    expect(await plannerAgile.workItemList.hasWorkItem(newWorkItem.title, true)).toBeFalsy();
  });
});
