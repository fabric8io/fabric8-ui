import { by, ElementFinder } from 'protractor';
import { BaseElement, Clickable } from './base.element';

class DropdownItem extends BaseElement {
  constructor(element: ElementFinder, parent: ElementFinder, name: string = '') {
    super(element, name);
    this.parent = parent;
  }

  async ready() {
    await this.run('ready', async () => {
      await super.ready();
      await this.untilClickable();
    });
  }

  async select() {
    await this.run(`select item: '${this.name}'`, async () => {
      await this.parent.ready();
      try {
        await this.clickWhenReady();
      } catch (e) {
        await this.click();
      }
    });
  }
}

export class DropdownMenu extends BaseElement {
  constructor(element: ElementFinder, name: string = '', itemClass: string = '') {
    super(element, name);
  }

  item(text: string): DropdownItem {
    let item = this.element(by.cssContainingText(this.itemClass ? this.itemClass : 'li', text));
    return new DropdownItem(item, this, text);
  }

  async ready() {
    // NOTE: not calling super as the menu is usually hidden and
    // supper.ready waits for item to be displayed
    await this.untilPresent();
  }
}

export class Dropdown extends BaseElement {
  menu: DropdownMenu;

  constructor(
    element: ElementFinder,
    menuElement: ElementFinder,
    name: string = '',
    itemClass: string = '',
  ) {
    super(element, name);
    this.menu = new DropdownMenu(menuElement);
  }

  item(text: string): DropdownItem {
    return this.menu.item(text);
  }

  async select(text: string) {
    await this.item(text).select();
  }

  async ready() {
    await this.run('ready', async () => {
      await super.ready();
      await this.untilClickable();
    });
  }
}

export class SingleSelectionDropdown extends Dropdown {
  input = new Clickable(this.$('input.combobox[type="text"]'), '');

  constructor(element: ElementFinder, menuElement: ElementFinder, name: string = '') {
    super(element, menuElement, name);
    this.input.name = name;
  }

  async ready() {
    await super.ready();
    await this.input.ready();
  }
}
