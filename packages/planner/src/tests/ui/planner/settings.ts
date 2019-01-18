import { ElementFinder } from 'protractor';
import * as ui from '../../ui';

export class Settings extends ui.BaseElement {
  settingsDropdownDiv = new ui.BaseElement(
    this.$('.f8-table-config__settings-dropdown'),
    'settings div',
  );
  settingsDropDown = new ui.Dropdown(
    this.$('.f8-table-config__settings .dropdown-toggle'),
    this.$('.f8-table-config__settings-dropdown'),
  );
  moveToDisplayedAttributeButton = new ui.Clickable(
    this.settingsDropdownDiv.$("span[tooltip='Move to Displayed Attributes']"),
    'move to displayed attribute',
  );
  moveToAvailableAttributeButton = new ui.Clickable(
    this.settingsDropdownDiv.$("span[tooltip='Move to Available Attributes']"),
    'move to available attribute',
  );
  close = new ui.Clickable(this.settingsDropdownDiv.$('.fa-close.btn'), ' close button');

  constructor(el: ElementFinder, name = 'Settings') {
    super(el, name);
  }

  async settingready() {
    await this.settingsDropDown.ready();
  }

  async clickSettings() {
    await this.settingsDropDown.ready();
    await this.settingsDropDown.clickWhenReady();
  }

  async selectAttribute(AttributeValue: string) {
    await this.settingsDropDown.select(AttributeValue);
  }

  async moveToDisplayedAttribute() {
    await this.moveToDisplayedAttributeButton.clickWhenReady();
    await this.close.clickWhenReady();
  }

  async moveToAvailableAttribute() {
    await this.moveToAvailableAttributeButton.clickWhenReady();
    await this.close.clickWhenReady();
  }
}
