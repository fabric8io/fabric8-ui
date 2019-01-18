import { browser, ElementArrayFinder, ElementFinder, ExpectedConditions as EC } from 'protractor';

import * as mixins from '../mixins';
import { DEFAULT_WAIT } from '../support';

// todo move to a different module

type NumberComparerFn = (x: number) => boolean;
type NumberComparer = number | NumberComparerFn;

function makeNumberComparer(compare: NumberComparer): NumberComparerFn {
  if (typeof compare == 'number') {
    return (n: number) => n >= compare;
  }
  return compare;
}

/**
 * to use with browser.wait to wait for multiple elements to present
 * e.g.
 *  browser.wait(untilCount($('foobar'), n => n >= 5 ))
 *  browser.wait(untilCount($('foobar'), 5)) // same as above
 */
function untilCount(elements: ElementArrayFinder, expectation: NumberComparer) {
  let compare: NumberComparerFn = makeNumberComparer(expectation);
  return () => elements.count().then(compare);
}

export interface BaseElementInterface {
  untilDisplayed(wait?: number): Promise<any>;
  untilPresent(wait?: number): Promise<any>;
  untilClickable(wait?: number): Promise<any>;
  clickWhenReady(wait?: number): Promise<any>;
}

export class BaseElement extends ElementFinder implements BaseElementInterface {
  // add logging mixin
  name: string = '';
  log!: (action: string, ...msg: string[]) => void;
  debug!: (context: string, ...msg: string[]) => void;
  fail!: (action: string, ...msg: string[]) => void;

  /**
   * Extend this class, to describe single custom fragment on your page
   *
   * @param {ElementFinder} elementFinder ElementFinder that you want to extend
   * @param {string} name to indentify the element in the logs
   */
  constructor(wrapped: ElementFinder, name: string = 'unnamed') {
    // Basically we are recreating ElementFinder again with same parameters
    super(wrapped.browser_, wrapped.elementArrayFinder_);
    this.name = name;
  }

  async untilClickable(timeout?: number) {
    try {
      await this.waitFor('clickable', EC.elementToBeClickable(this), timeout);
    } catch (e) {
      this.fail('ERROR Element: ', this.name, 'is not clickable');
    }
  }

  async untilPresent(timeout?: number) {
    try {
      await this.waitFor('present', EC.presenceOf(this), timeout);
    } catch (e) {
      this.fail('ERROR Element: ', this.name, 'is not present');
    }
  }

  async untilDisplayed(timeout?: number) {
    try {
      await this.waitFor('visible', EC.visibilityOf(this), timeout);
    } catch (e) {
      this.fail('ERROR Element: ', this.name, 'is not displayed');
    }
  }

  async untilTextIsPresent(text: string, timeout?: number) {
    try {
      let condition = EC.textToBePresentInElement(this, text);
      await this.waitFor(`text ${text}`, condition, timeout);
    } catch (e) {
      this.fail('ERROR Element: ', this.name, 'text is not present');
    }
  }

  async untilTextIsPresentInValue(text: string, timeout?: number) {
    try {
      let condition = EC.textToBePresentInElementValue(this, text);
      await this.waitFor(`text ${text}`, condition, timeout);
    } catch (e) {
      this.fail('ERROR Element: ', this.name, 'text is not present in value');
    }
  }

  async untilHidden(timeout?: number) {
    try {
      await this.waitFor('hidden', EC.invisibilityOf(this), timeout);
    } catch (e) {
      this.debug('Element: ', this.name, ' no longer exists.');
    }
  }

  async untilAbsent(timeout?: number) {
    await this.waitFor('absence', EC.stalenessOf(this), timeout);
  }

  async clickWhenReady(timeout?: number) {
    await this.run('click', async () => {
      await this.untilDisplayed(timeout);
      await this.untilClickable(timeout);
      await this.click();
    });
  }

  async ready() {
    // TODO: may have to revert back to just until present
    // await this.untilPresent();
    await this.untilDisplayed();
  }

  private async waitFor(msg: string, condition: Function, timeout?: number) {
    let wait: number = timeout || DEFAULT_WAIT;
    this.debug(`waiting for "${msg}"`, `  | timeout: '${wait}'`);
    await browser.wait(condition, wait);
    this.debug(`waiting for "${msg}"`, '  - OK');
  }

  async run(msg: string, fn: () => Promise<any>) {
    this.debug(msg, '- ACTION STARTED');
    await fn();
    this.debug(msg, '- DONE');
  }

  async getTextWhenReady(timeout?: number): Promise<string> {
    await this.untilDisplayed(timeout);
    return this.getText();
  }

  async scrollIntoView() {
    await browser.executeScript('arguments[0].scrollIntoView(true)', this.getWebElement());
  }
}

export class BaseElementArray extends ElementArrayFinder {
  // Loggin Mixin
  log!: (action: string, ...msg: string[]) => void;
  debug!: (context: string, ...msg: string[]) => void;

  constructor(wrapped: ElementArrayFinder, name: string = 'unnamed') {
    // see: clone https://github.com/angular/protractor/blob/5.2.0/lib/element.ts#L106
    super(wrapped.browser_, wrapped.getWebElements, wrapped.locator_, wrapped.actionResults_);
    this.name = name;
  }

  async untilCount(compare: NumberComparer, wait?: number, msg?: string) {
    await browser.wait(untilCount(this, compare), wait, msg);
  }

  async ready(count: number = 1) {
    await this.untilCount(count);
    await this.each(async (item: ElementFinder, index: number) => {
      let tempItem = new BaseElement(item, this.name + ' - ' + index);
      await tempItem.ready();
    });
  }

  async getTextWhenReady(): Promise<String> {
    await this.ready();
    return this.getText();
  }

  async untilHidden() {
    await this.each(async (item: ElementFinder, index: number) => {
      let tempItem = new BaseElement(item, this.name + ' - ' + index);
      try {
        await tempItem.untilHidden();
      } catch (e) {
        this.debug('Element: ', tempItem.name, ' no longer exists.');
      }
    });
  }
}

export class Clickable extends BaseElement {
  async ready() {
    await this.run('ready', async () => {
      await super.ready();
      await this.untilClickable();
    });
  }
}

mixins.applyMixins(BaseElement, [mixins.Logging]);
mixins.applyMixins(BaseElementArray, [mixins.Logging]);
