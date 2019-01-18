import { browser } from 'protractor';
import { PlannerPage } from '../../page_objects/planner';
import * as support from '../../support';

/* Smoke Tests */

describe('Planner Smoke Tests:', () => {
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

  it('create a work item and add/remove assignee', async () => {
    let newWorkItem1 = {
        title: 'Workitem Title',
        description: 'Describes the work item',
      },
      user1 = process.env.USER_FULLNAME;
    await planner.createWorkItem(newWorkItem1);
    expect(await planner.workItemList.hasWorkItem(newWorkItem1.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(newWorkItem1.title);
    await planner.quickPreview.addAssignee(user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).toContain(user1);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(newWorkItem1.title);
    await browser.sleep(2000);
    await planner.quickPreview.removeAssignee(user1 + ' (me)');
    expect(await planner.quickPreview.getAssignees()).not.toContain(user1);
    await planner.quickPreview.close();
  });

  it('update workitem title/description', async () => {
    let newWorkItem2 = { title: 'Workitem Title 1' },
      updatedWorkItem = {
        title: 'New Workitem Title',
        description: 'New WorkItem Description',
      };
    await planner.createWorkItem(newWorkItem2);
    expect(await planner.workItemList.hasWorkItem(newWorkItem2.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(newWorkItem2.title);
    await planner.quickPreview.updateTitle(updatedWorkItem.title);
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(updatedWorkItem.title);
    await planner.quickPreview.updateDescription(updatedWorkItem.description);
    expect(await planner.quickPreview.getDescription()).toBe(updatedWorkItem.description);
    await planner.quickPreview.close();
    expect(await planner.workItemList.hasWorkItem(newWorkItem2.title, true)).toBeFalsy();
    expect(await planner.workItemList.hasWorkItem(updatedWorkItem.title)).toBeTruthy();
  });

  it('update of empty workitem title is not allowed', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateTitle('');
    expect(await planner.quickPreview.getTitleError()).toBe('Empty title not allowed');
  });

  //creator is no more a field in the quick-preview/detail-page as per the new design
  //it might change again so not remmoving the test
  xit('Check WorkItem creator name and image is reflected', async () => {
    let prodAvatar = 'https://avatars0.githubusercontent.com/u/563119?v=3&s=25',
      prodPreviewAvatar =
        'https://www.gravatar.com/avatar/d77d23eebe9907842b8ad9f1d9905454.jpg&s=25',
      workItemTitle2 = 'Workitem_Title_2',
      user1 = process.env.USER_FULLNAME;
    await planner.workItemList.clickWorkItem(workItemTitle2);
    await planner.quickPreview.ready();
    /* Run tests against production or prod-preview */
    let url = await browser.getCurrentUrl();
    if (url.startsWith('https://openshift.io')) {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(prodAvatar);
    } else if (url.startsWith('https://prod-preview.openshift.io/')) {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(prodPreviewAvatar);
    } else {
      expect(await planner.quickPreview.getCreatorAvatar()).toBe(c.user_avatar);
    }
    expect(await planner.quickPreview.getCreator()).toBe(user1);
    await planner.quickPreview.close();
  });

  it('Associate workitem with an Area', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addArea(c.dropdownareaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle1);
    await planner.quickPreview.close();

    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle1);
    await planner.quickPreview.addArea(c.dropdownareaTitle2);
    expect(await planner.quickPreview.getArea()).not.toBe(c.areaTitle1);
    expect(await planner.quickPreview.getArea()).toBe(c.areaTitle2);
    await planner.quickPreview.close();
  });

  it('Associate/Re-associate workitem with an Iteration', async () => {
    //add new iteration
    let title = await planner.createUniqueWorkItem(),
      randomText = 'zxz';
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addIteration(c.dropdownIteration1);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration1);
    await planner.quickPreview.close();

    //update iteration
    await planner.workItemList.clickWorkItem(title);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration1);
    await planner.quickPreview.addIteration(c.dropdownIteration_2);
    expect(await planner.quickPreview.getIteration()).toBe(c.iteration2);

    //search iteration
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.typeaHeadSearch(randomText);
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).toBe(
      'No matches found.',
    );
    await planner.quickPreview.iterationDropdownCloseButton.clickWhenReady();
    await planner.quickPreview.iterationDropdown.clickWhenReady();
    expect(await planner.quickPreview.iterationDropdown.menu.getTextWhenReady()).not.toBe(
      'No matches found.',
    );
  });

  it('Edit Comment and Save', async () => {
    let newWorkItem3 = { title: 'New Workitem' },
      comment = 'new comment';
    await planner.createWorkItem(newWorkItem3);
    expect(await planner.workItemList.hasWorkItem(newWorkItem3.title)).toBeTruthy();
    await planner.workItemList.clickWorkItem(newWorkItem3.title);
    await planner.quickPreview.addCommentAndSave(comment);
    expect(await planner.quickPreview.getComments()).toContain(comment);
  });

  it('Edit Comment and Cancel', async () => {
    let comment = 'new comment',
      title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addCommentAndCancel(comment);
    expect(await planner.quickPreview.getComments()).not.toContain('new comment');
  });

  it('Create custom query', async () => {
    await planner.sidePanel.clickWorkItemGroup();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', c.stateInProgress);
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('Query 1');
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('Query 1');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('Query 1');
  });

  it('Delete custom query', async () => {
    await planner.sidePanel.clickWorkItemGroup();
    await planner.workItemList.overlay.untilHidden();
    await planner.header.selectFilter('State', c.stateResolved);
    await planner.workItemList.overlay.untilHidden();
    await planner.header.saveFilters('My filter');
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.customQuery.untilTextIsPresent('My filter');
    expect(await planner.sidePanel.getMyFiltersList()).toContain('My filter');
    await planner.sidePanel.selectcustomFilterKebab('My filter');
    await planner.sidePanel.deleteCustomQuery.clickWhenReady();
    await planner.confirmModalButton.clickWhenReady();
    await browser.sleep(1000);
    expect(await planner.sidePanel.getMyFiltersList()).not.toContain('My filter');
  });

  it('Update work item with a label and validate description', async () => {
    let title = await planner.createUniqueWorkItem();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.updateDescription('My new description');
    await planner.quickPreview.createNewLabel('Validate description label');
    expect(await planner.quickPreview.getLabels()).toContain('Validate description label');
    await planner.quickPreview.close();
    await planner.workItemList.clickWorkItem(title);
    await planner.quickPreview.addLabel('Validate description label', true);
    expect(await planner.quickPreview.getDescription()).toBe('My new description');
    await planner.quickPreview.close();
  });

  it('Create a work item and Open detail page', async () => {
    await planner.quickAdd.addAndOpenWorkItem(c.workitem);
    await planner.waitUntilUrlContains('detail');
    await planner.detailPage.titleInput.untilTextIsPresentInValue('new detail workItem');
    await planner.detailPage.closeButton.ready();
    expect(await browser.getCurrentUrl()).toContain('detail');
    await planner.detailPage.close();
    await planner.waitUntilUrlContains('typegroup');
    expect(await planner.workItemList.hasWorkItem('new detail workItem')).toBeTruthy();
  });

  it('Add new work-item to the selected iteration', async () => {
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.clickIteration('Iteration_1');
    await planner.workItemList.overlay.untilHidden();
    await planner.quickAdd.addWorkItem({ title: 'Add new work item to iteration test' });
    expect(
      await planner.workItemList.hasWorkItem('Add new work item to iteration test'),
    ).toBeTruthy();
    await planner.sidePanel.clickWorkItemGroup();
    await planner.workItemList.overlay.untilHidden();
    await planner.sidePanel.clickIteration('Iteration_1');
    expect(
      await planner.workItemList.hasWorkItem('Add new work item to iteration test'),
    ).toBeTruthy();
  });
});
