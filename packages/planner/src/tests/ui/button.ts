import { ElementFinder } from 'protractor';
import { Clickable } from './base.element';

export class Button extends Clickable {
  constructor(element: ElementFinder, name?: string) {
    super(element, name);
  }
}
