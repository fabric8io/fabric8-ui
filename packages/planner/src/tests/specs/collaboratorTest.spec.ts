import { browser } from 'protractor';
import { PlannerPage } from '../page_objects/planner';
import * as support from '../support';

describe('Planner Collaborator Tests:', () => {
  let planner: PlannerPage;
  let planner1: PlannerPage;
  let c = new support.Constants();

  beforeAll(async () => {
    await support.desktopTestSetup();
    planner = new PlannerPage(browser.baseUrl);
    await planner.openInBrowser();
    let url = await browser.getCurrentUrl();
    let URL = '';
    /* Run tests against production or prod-preview */
    if (url.startsWith('https://openshift.io')) {
      let urlPathName: any = await browser.executeScript('return document.location.pathname');
      URL = url.replace(urlPathName, '/rgarg-osiotest1/DO_NOT_DELETE/plan');
    } else {
      let urlPathName: any = await browser.executeScript('return document.location.pathname');
      URL = url.replace(urlPathName, '/rbajpai-test-preview/DO_NOT_DELETE/plan');
    }
    planner1 = new PlannerPage(URL);
    await browser.get(URL);
    await planner.waitUntilUrlContains('typegroup');
    await planner.waitUntilTitleContains('Plan');
  });

  beforeEach(async () => {
    await planner.sidePanel.ready();
    await planner.workItemList.ready();
    await planner.workItemList.overlay.untilHidden();
  });

  it('Non Collaborator should not be able edit a workItem title', async () => {
    await planner1.workItemList.clickWorkItem('Work Item 5');
    expect(await planner1.quickPreview.titleInput.getAttribute('disabled')).toBe('true');
  });

  it('Non Collaborator should not be able edit state of a workitem', async () => {
    await planner1.workItemList.clickWorkItem('Work Item 4');
    await planner1.quickPreview.stateDropdown.clickWhenReady();
    expect(await planner1.quickPreview.stateDiv.getAttribute('innerText')).not.toContain(
      'Update Type',
    );
  });

  it('Non collaborator should not be able to add assignee', async () => {
    await planner1.workItemList.clickWorkItem('Work Item 4');
    expect(await planner1.quickPreview.assigneeSection.getTextWhenReady()).not.toBe(
      ' Add Assignee ',
    );
  });

  it('Non collaborator should Comment and Save', async () => {
    let comment = 'new comment';
    /* to avoid workitem conflict should comment on 2 different workitem */
    await planner1.workItemList.clickWorkItem(c.commentCollaboratorTest);
    await planner1.quickPreview.addCommentAndSave(comment);
    expect(await planner1.quickPreview.getComments()).toContain(comment);
  });

  it('Non collaborator should not be able to update Area ', async () => {
    await planner1.workItemList.clickWorkItem('Work Item 3');
    await planner1.quickPreview.areaDropdown.clickWhenReady();
    expect(await planner1.quickPreview.areaDiv.getAttribute('innerText')).not.toContain(
      'Update area',
    );
  });

  it('Non collaborator should not be able to update Iteration ', async () => {
    await planner1.workItemList.clickWorkItem('Work Item 3');
    await planner1.quickPreview.iterationDropdown.clickWhenReady();
    expect(await planner1.quickPreview.iterationDiv.getAttribute('innerText')).not.toContain(
      'Update iteration',
    );
  });
});
