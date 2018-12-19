import { ElementFinder } from 'protractor';
import * as ui from '../../ui';
import { WorkItem } from './index';

export class WorkItemInlineQuickAdd extends ui.BaseElement {
  titleTextInlineInput = new ui.TextInput(
    this.$('input.f8-quickadd-input'),
    'Work item inline Title',
  );
  buttonsDiv = this.$('div.f8-quickadd__wiblk-btn.pull-right');
  addInlineQuickAddButton = new ui.Button(
    this.buttonsDiv.$('#quickadd-save'),
    'Add Inline Quick Add Button',
  );
  workItemTypeDropdown = new ui.Dropdown(
    this.$('.f8-quickadd__wiblk button.dropdown-toggle'),
    this.$('.f8-quickadd__wiblk .dropdown-menu'),
    'WorkItem Type inline dropdown',
  );

  constructor(el: ElementFinder, name = 'Work Item Inline Quick Add') {
    super(el, name);
  }

  async ready() {
    await super.ready();
    await this.addAndOpenButton.ready();
  }

  async addInlineWorkItem({ title, description = '', type = '' }: WorkItem) {
    await this.workItemTypeDropdown.clickWhenReady();
    await this.workItemTypeDropdown.select(type);
    await this.titleTextInlineInput.ready();
    await this.titleTextInlineInput.enterText(title);
    await this.addInlineQuickAddButton.clickWhenReady();
    // TODO add more confirmation that the item has been added
    this.log('New Inline WorkItem created', `${title} added`);
  }

  async workItemTypes(): Promise<string[]> {
    await this.workItemTypeDropdown.clickWhenReady();
    let array = await this.workItemTypeDropdown.menu.getTextWhenReady();
    // Split array, remove invalid entries and trim the result
    return array.split('\n').reduce<string[]>((filtered, current) => {
      if (current) {
        filtered.push(current.trim());
      }
      return filtered;
    }, []);
  }
}
