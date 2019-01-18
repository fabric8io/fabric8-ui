import { by, ElementFinder } from 'protractor';
import { BaseElement } from './base.element';
import { Checkbox } from './checkbox';

export class MultipleSelectionList extends BaseElement {
  list = new BaseElement(this.$('div > ul'));

  constructor(element: ElementFinder, name: string = '') {
    super(element, name);
  }

  async ready() {
    await super.ready();
    await this.list.ready();
  }

  item(text: string) {
    let el = this.list.element(by.cssContainingText('li.checkbox label', text));
    return new Checkbox(el);
  }

  async select(text: string) {
    let checkbox = this.item(text);
    await checkbox.clickWhenReady();
  }
}
