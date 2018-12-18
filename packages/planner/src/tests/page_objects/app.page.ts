import { $, browser, by, element, ExpectedConditions as until } from 'protractor';
import * as support from '../support';
import { BaseElement, Clickable } from '../ui';
import { BasePage } from './base.page';

export abstract class AppPage extends BasePage {
  appTag = $('f8-app');
  mainNavBar = new BaseElement(
    $('header ul.navbar-primary.persistent-secondary'),
    'Main Navigation Bar',
  );
  planTab = new Clickable(this.mainNavBar.element(by.xpath("//span[text()='Plan']")), 'Plan Tab');
  backLogTab = new Clickable(
    this.mainNavBar.element(by.xpath("//span[text()=' Backlog ']")),
    'Backlog Tab',
  );
  boardTab = new Clickable(
    this.mainNavBar.element(by.xpath("//span[text()=' Board ']")),
    'Board Tab',
  );
  QueryTab = new Clickable(
    element(by.cssContainingText('.nav.persistent-secondary li>a', 'Query')),
    'Query Tab',
  );

  /**
   * Extend this class, to describe Application Page(after logging in)
   *
   * @param {url} string URL where the extended page resides
   */
  constructor(url?: string) {
    super(url);
  }

  /**
   * Returns an instance of the BaseElement that can be found using
   * the {css} and contains the {text}.
   *
   * @param {ui} The Base Element Class e.g. Button, TextInput
   * @param {css}  Css within the appTag that identifies the element
   * @param {text} text in the element
   *
   */
  innerElement(ui: typeof BaseElement, css: string, text: string): BaseElement {
    const element = this.appTag.element(by.cssContainingText(css, text));
    return new ui(element, text);
  }

  async ready() {
    await browser.wait(until.visibilityOf(this.appTag));
  }

  async clickPlanTab() {
    await this.planTab.clickWhenReady();
  }

  async clickBacklogTab() {
    await this.backLogTab.clickWhenReady();
  }

  async clickBoardTab() {
    await this.boardTab.clickWhenReady();
  }

  async clickQueryTab() {
    await this.QueryTab.clickWhenReady();
  }
}
