import { $, browser, Key } from 'protractor';
import { v4 as uuid } from 'uuid';
import { AppPage } from '../app.page';
import * as support from './../../support';
import * as planner from './../../ui/planner';

// this is what you see when you click on the Plan Tab button
export class PlannerPage extends AppPage {
  workItemList = new planner.WorkItemList($('alm-work-item-list'));
  quickAdd = new planner.WorkItemQuickAdd($('alm-work-item-quick-add'));
  inlineQuickAdd = new planner.WorkItemInlineQuickAdd($('#workItemList_quickAdd_inline'));
  sidePanel = new planner.SidePanel($('aside.f8-sidepanel'));
  quickPreview = new planner.WorkItemQuickPreview($('work-item-detail'));
  header = new planner.ToolbarHeader($('#header-div'));
  settings = new planner.Settings($('div.f8-table-config__settings'));
  iteration = new planner.Iteration($('fab-planner-iteration-modal'));
  detailPage = new planner.WorkItemDetailPage($('work-item-detail'));
  confirmModalButton = new planner.WorkItemList($('#modal-confirm'));
  query = new planner.Query($('planner-query'));
  modal = new planner.ModalDialog($('modal'));

  constructor(url: string) {
    super(url);
  }

  async ready() {
    support.debug(' ... check if Planner page is Ready');
    await super.ready();
    await this.workItemList.ready();
    await this.quickAdd.ready();
    await this.sidePanel.ready();
    support.debug(' ... check if Planner page is Ready - OK');
  }

  async createWorkItem(item: planner.WorkItem) {
    this.debug('create item', JSON.stringify(item));
    await this.quickAdd.addWorkItem(item);
  }

  async createUniqueWorkItem(): Promise<string> {
    let workItemTitle = uuid();
    await this.createWorkItem({ title: workItemTitle });
    return workItemTitle;
  }

  async createInlineWorkItem(item: planner.WorkItem) {
    this.debug('create inline item', JSON.stringify(item));
    await this.inlineQuickAdd.addInlineWorkItem(item);
  }

  async resetState() {
    await this.sidePanel.clickWorkItemGroup();
    await $('body').sendKeys(Key.ESCAPE);
  }
}
