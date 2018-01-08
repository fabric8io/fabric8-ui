import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { Logger } from 'ngx-base';

@Injectable()
export class CopyService {
  dom: Document;

  constructor(
      private logger: Logger,
      @Inject(DOCUMENT) dom: Document) {
    this.dom = dom;
  }

  /**
   * Copy token to the user's system clipboard
   */
  copy(value: string): boolean {
    let result = false;
    let textarea = this.dom.createElement('textarea');

    textarea.style.height = '0px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.width = '0px';
    textarea.value = value;

    this.dom.body.appendChild(textarea);
    textarea.select();

    try {
      result = this.dom.execCommand('copy');
    } catch (error) {
      this.handleError(error);
    } finally {
      if (textarea.parentNode !== undefined) {
        textarea.parentNode.removeChild(textarea);
      }
    }
    return result;
  }

  // Private

  private handleError(error: any): void {
    this.logger.error(error);
  }
}
