import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';

describe('Query tests', () => {
  let planner: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    await planner.waitUntilUrlContains('typegroup');
  });

  it('should display search query result', async () => {
    let searchQuery = `typegroup.name : ${c.group1}`;
    await planner.clickQueryTab();
    await planner.waitUntilUrlContains('query');
    expect(await browser.getCurrentUrl()).toContain('query');
    await planner.query.enterQuery(searchQuery);
    expect(await planner.query.getDataTableHeaderCellCount()).toBe(8);
  });

  it('should create a new Workitem', async () => {
    let title: string = 'Create work item from query page',
      searchQuery: string = `title:${title}`;
    await planner.clickQueryTab();
    await planner.waitUntilUrlContains('query');
    await planner.query.createWorkItem(title);
    await planner.quickPreview.notificationToast.untilCount(1);
    expect(await planner.quickPreview.notificationToast.count()).toBe(1);
    await planner.query.enterQuery(searchQuery);
    expect(await planner.query.hasWorkItem(title)).toBe(true);
  });

  it('should delete a work item', async () => {
    let title: string = 'Delete work item from query page',
      searchQuery: string = `title:${title}`;
    await planner.clickQueryTab();
    await planner.waitUntilUrlContains('query');
    await planner.query.createWorkItem(title);
    await planner.query.enterQuery(searchQuery);
    expect(await planner.query.hasWorkItem(title)).toBe(true);
    await planner.query.clickWorkItemDeleteIcon(title);
    await planner.modal.clickConfirmButton();
    expect(await planner.query.emptyTemplateDisplayed()).toBe(true);
  });
});
