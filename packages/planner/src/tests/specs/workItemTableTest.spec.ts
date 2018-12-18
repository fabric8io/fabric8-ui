import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';
import { SidePanel } from './../ui/planner/sidepanel';

describe('Work Item datatable list: ', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
  });

  beforeEach(async () => {
    await planner.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  afterEach(async () => {
    await planner.resetState();
  });

  it('should open settings button and hide columns', async () => {
    let attribute1 = 'Iteration',
      attribute2 = 'Label',
      attribute3 = 'Creator',
      attribute4 = 'Assignees';
    expect(await planner.workItemList.getDataTableHeaderCellCount()).toBe(9);
    await planner.settings.clickSettings();
    await planner.settings.selectAttribute(attribute1);
    await planner.settings.moveToAvailableAttribute();
    expect(await planner.workItemList.getDataTableHeaderCellCount()).toBe(8);
    await planner.settings.clickSettings();
    await planner.settings.selectAttribute(attribute1);
    await planner.settings.moveToDisplayedAttribute();
    expect(await planner.workItemList.getDataTableHeaderCellCount()).toBe(9);
  });

  it('quick add should be disable for flat view', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.header.clickShowTree();
    await browser.sleep(2000);
    await planner.workItemList.overlay.untilHidden();
    expect(await planner.workItemList.getInlineQuickAddClass(title)).toContain('disable');
    await planner.header.clickShowTree();
  });

  it('should filter work item by type', async () => {
    await planner.header.selectFilter('Type', c.type);
    expect(await planner.header.getFilterConditions()).toContain(c.workItemTypeFilter);
  });

  it('hideTree and create a work item then work item should be displayed when show tree is selected', async () => {
    let newWorkItem1 = { title: 'New WorkItem' };
    await planner.header.clickShowTree();
    await planner.workItemList.overlay.untilHidden();
    await planner.createWorkItem(newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(newWorkItem1.title)).toBeTruthy();
    await planner.header.clickShowTree();
    expect(await planner.workItemList.hasWorkItem(newWorkItem1.title)).toBeTruthy();
  });

  it('check show completed and create a work item then update status to closed and uncheck show completed then work item should not visible in list', async () => {
    await planner.header.clickShowCompleted();
    await planner.workItemList.overlay.untilHidden();
    let newWorkItem = {
      title: 'Check for show complete work item',
    };
    await planner.createWorkItem(newWorkItem);
    expect(await planner.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(newWorkItem.title);
    await planner.quickPreview.changeStateTo(c.stateClosed);
    await planner.quickPreview.close();
    await planner.header.clickShowCompleted();
    expect(await planner.workItemList.hasWorkItem(newWorkItem.title, true)).toBeFalsy();
  });

  it('work item should show updated title when switching from flat to tree view', async () => {
    let updatedWorkItem = {
      title: 'test show updated work item',
    };

    let title = await planner.createUniqueWorkItem();
    await planner.header.clickShowTree();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.titleInput.untilTextIsPresentInValue(title);
    await planner.quickPreview.updateTitle(updatedWorkItem.title);
    await planner.quickPreview.titleInput.untilTextIsPresentInValue(updatedWorkItem.title);
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(updatedWorkItem.title)).toBeTruthy();
    await planner.header.clickShowTree();
    expect(await planner.workItemList.hasWorkItem(updatedWorkItem.title)).toBeTruthy();
  });

  it('list should not update when new label is added', async () => {
    let title = await planner.createUniqueWorkItem(),
      newLabel1 = 'new label 1',
      LabelTestTitle = {
        title: 'test list is not updated when new label is added',
      };
    expect(await planner.workItemList.hasWorkItem(title)).toBeTruthy();
    await planner.workItemList.workItem(title).clickInlineQuickAdd();
    await planner.createInlineWorkItem(LabelTestTitle);
    expect(await planner.workItemList.hasWorkItem(LabelTestTitle.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.createNewLabel(newLabel1);
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(LabelTestTitle.title)).toBeTruthy();
  });

  it('list should not update when new iteration is added', async () => {
    let title = await planner.createUniqueWorkItem(),
      newIteration1 = 'new Iteration 1',
      childWorkItem = {
        title: 'test list is not updated when new iteration is added',
        type: c.childType,
      };
    expect(await planner.workItemList.hasWorkItem(title)).toBeTruthy();
    await planner.workItemList.workItem(title).clickInlineQuickAdd();
    await planner.createInlineWorkItem(childWorkItem);
    expect(await planner.workItemList.hasWorkItem(childWorkItem.title)).toBeTruthy();
    await planner.sidePanel.createNewIteration();
    await planner.iteration.addNewIteration(newIteration1, c.rootIteration);
    await planner.iteration.clickCreateIteration();
    expect(await planner.workItemList.hasWorkItem(childWorkItem.title)).toBeTruthy();
  });

  it('clicking on label should filter the workitem list by label', async () => {
    let label = 'sample_label_1',
      labelFilter = 'label: sample_label_1',
      workItemTitle = { title: 'test clicking on label should filter the workitem list by label' };

    await planner.sidePanel.clickWorkItemGroup();
    await planner.createWorkItem(workItemTitle);
    await planner.workItemList.clickWorkItem(workItemTitle.title);
    await planner.quickPreview.addLabel(label);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItemLabel(workItemTitle.title);
    expect(await planner.header.getFilterConditions()).toContain(labelFilter);
    await planner.header.clickShowTree();
    expect(await planner.header.getFilterConditions()).toContain(labelFilter);
  });

  it('should update the workitem List on workitem edit', async () => {
    let workitem = { title: 'TITLE_TEXT' };
    await planner.header.selectFilter('State', c.stateNew);
    await planner.createWorkItem(workitem);
    await planner.workItemList.clickWorkItem(workitem.title);
    await planner.quickPreview.changeStateTo(c.stateOpen);
    await planner.quickPreview.close();
    expect(await planner.workItemList.isTitleTextBold(workitem.title)).not.toContain('bold');
  });

  it('should make the title bold based on filter when adding a new workitem', async () => {
    let workitem = { title: 'test title bold test' };
    await planner.header.selectFilter('State', c.stateNew);
    await planner.createWorkItem(workitem);
    expect(await planner.workItemList.hasWorkItem(workitem.title)).toBeTruthy();
    expect(await planner.workItemList.isTitleTextBold(workitem.title)).toContain('bold');
  });

  it('should filter the workitem list by Assignee', async () => {
    let labelFilter = 'assignee: Unassigned';
    await planner.workItemList.overlay.untilHidden();
    let countUnassignedWorkItem = await planner.workItemList.getUnassignedWorkItemCount(
      ' Unassigned ',
    );
    await planner.header.selectFilter('Assignee', 'Unassigned');
    await browser.sleep(1000);
    expect(await planner.header.getFilterConditions()).toContain(labelFilter);
    expect(await planner.workItemList.datatableRow.count()).toEqual(countUnassignedWorkItem);
  });

  it('Should filter the work item by close state', async () => {
    let newWorkItem = {
      title: 'Should filter the work item by close state - xxx',
    };
    await planner.createWorkItem(newWorkItem);
    expect(await planner.workItemList.hasWorkItem(newWorkItem.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(newWorkItem.title);
    await planner.quickPreview.changeStateTo(c.stateClosed);
    await planner.quickPreview.close();
    await planner.header.selectFilter('State', c.stateClosed);
    await planner.workItemList.overlay.untilHidden();
    expect(await planner.header.getFilterConditions()).toContain(c.filterLabel);
    expect(await planner.workItemList.hasWorkItem(newWorkItem.title, true)).toBeTruthy();
  });
});
