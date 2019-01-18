import { browser, ExpectedConditions } from 'protractor';
import * as mixins from '../mixins';
import * as support from '../support';

export enum PageOpenMode {
  AlreadyOpened,
  RefreshBrowser,
}

export abstract class BasePage {
  // add logging mixin

  name: string = '...';
  log!: (action: string, ...msg: string[]) => void;
  debug!: (context: string, ...msg: string[]) => void;

  // Use undefined to indicate the url has not been set
  // It will use be in openInBrowser to throw error if the caller forgot
  // to set the url. Need to do this because '' is a valid url and
  // refers to the baseUrl

  protected url: string | undefined;

  constructor(url?: string) {
    this.url = url;
    this.debug(`url: '${url}'`);
  }

  async ready() {}

  async open(mode: PageOpenMode = PageOpenMode.AlreadyOpened): Promise<BasePage> {
    if (mode === PageOpenMode.RefreshBrowser) {
      await this.openInBrowser();
    }

    await this.ready();
    this.log('Opened');
    return this;
  }

  async openInBrowser() {
    if (this.url === undefined) {
      throw Error('Trying to open an undefined url');
    }
    this.log('Authenticating with Auth and Refresh token');
    await support.loginWithTokens();
    this.log('Opening', this.url);
    let currentUrl = await browser.getCurrentUrl();
    this.debug('at  :', currentUrl);

    this.debug(`goto: '${this.url}'`);
    await browser.get(this.url);

    let urlNow = await browser.getCurrentUrl();
    this.debug('now :', urlNow);
    // wait for page to load
    await this.waitUntilUrlContains('typegroup');
    await this.waitUntilTitleContains('Plan');
  }

  async waitUntilUrlContains(text: string, timeout?: number) {
    await browser.wait(ExpectedConditions.urlContains(text), timeout);
  }

  async waitUntilTitleContains(title: string) {
    await browser.wait(ExpectedConditions.titleContains('Plan'));
  }
}

mixins.applyMixins(BasePage, [mixins.Logging]);
