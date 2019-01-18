import { Key } from 'protractor';
import * as ui from '../../ui';
import { BaseElement, Clickable } from './../base.element';
import { WorkItemList } from './workitem-list';

export class Query extends WorkItemList {
  private queryTextInput = new ui.TextInput(
    this.$('input[placeholder="Enter your Query..."]'),
    'Enter your Query',
  );
  private createWorkItemButton = new ui.BaseElement(
    this.$('.f8-query__create-workitem> button'),
    ' Create work Item',
  );
  private createWorkItemMenu = new ui.BaseElement(
    this.$('.f8-query__create-workitem-menu'),
    'create work item menu',
  );
  private titleTextInput = new ui.TextInput(
    this.createWorkItemMenu.$('input[placeholder=" Type your title...."]'),
    'title',
  );
  private createButton = new ui.Clickable(
    this.createWorkItemMenu.$('#quickadd-save'),
    'create button',
  );

  async enterQuery(query: string, append: boolean = false) {
    await this.queryTextInput.ready();
    if (!append) {
      await this.queryTextInput.clear();
    }
    await this.queryTextInput.enterText(query);
    await this.queryTextInput.enterText(Key.ENTER);
    await this.datatableHeaderCell.untilCount(8);
  }

  async createWorkItem(title: string) {
    await this.createWorkItemButton.ready();
    await this.createWorkItemButton.clickWhenReady();
    await this.createWorkItemMenu.untilDisplayed();
    await this.titleTextInput.enterText(title);
    await this.createButton.clickWhenReady();
  }
}
