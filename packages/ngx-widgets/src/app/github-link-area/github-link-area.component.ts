import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GitHubLinkService } from './github-link.service';

/**
 * GitHub Link Area component. This shows a formatted link to GitHub with an
 * indicator of whether the GitHub issue is open or closed in an text area.
 * Works only for public remote repositories for now. See example for how to
 * use this.
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'github-link-area',
  styleUrls: ['./github-link-area.component.less'],
  templateUrl: './github-link-area.component.html',
})
export class GitHubLinkAreaComponent implements OnChanges, AfterViewChecked {
  @Input('content') content: string | SafeHtml;

  @Output('onInputEvent') onInputEvent = new EventEmitter();

  constructor(
    private gitHubLinkService: GitHubLinkService,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.content) {
      this.updateOnChanges();
    }
  }

  ngAfterViewChecked(): void {
    this.instrumentInputs();
  }

  /*
   * Because Angular testing is broken, we need to be able to call
   * this from a test. See reason here:
   * https://github.com/angular/angular/issues/9866
   */
  updateOnChanges() {
    this.updateLinkTexts();
    this.updateLinks();
  }

  /*
   * Instruments the input elements in the content. This is used to report
   * any interaction with inputs back to the parent using Outputs. This feature
   * is used in the checkbox feature downstream.
   */
  instrumentInputs() {
    // this uses a trick. The problem is that ngAfterViewChecked() is called
    // multiple times and causes EventListeners added to the inputs multiple
    // times. Using a dirty bit does not work as Angular is ansychronous and
    // updates can happen between setting the EventListener and reverting the
    // dirty bit.
    // keeping track of the elements with EventListeners is also not working
    // without a lot of extra work. So we do a trick and add a custom attribute
    // to the input element when we added the EventListener. The selector
    // matches only elements without that attribute, so we have a lightweight
    // way of making sure each input element exactly gets one EventListener
    // attached.
    const el = this.elementRef;
    if (el) {
      const inputElements = el.nativeElement.querySelectorAll('input:not([data-event-attached])');
      if (inputElements && inputElements.length > 0) {
        // we need to use a classic loop instead of forEach here
        // as forEach on NodeLists is not supported on every browser.
        // Example: Chrome works, but Protractor not.
        for (let i = 0; i < inputElements.length; ++i) {
          inputElements[i].setAttribute('data-event-attached', 'true');
          inputElements[i].addEventListener(
            'change',
            (ref: any) => {
              // we only support checkboxes for now, but the mechanism is generic.
              // add new interactions here if needed.
              if (ref.target && ref.target.getAttribute('type') === 'checkbox') {
                const indexStr = ref.target.getAttribute('data-checkbox-index');
                this.onInputEvent.emit({
                  type: 'checkbox',
                  // '+' converts the string to an int.
                  extraData: {
                    checkboxIndex: +indexStr,
                    checked: ref.target.checked,
                  },
                });
              }
            },
            false,
          );
        }
      }
    }
  }

  wrapStringSafeValue(input: string | SafeHtml): SafeHtml {
    if (typeof input === 'string') {
      return this.sanitizer.bypassSecurityTrustHtml(input);
    }
    return input;
  }

  unwrapStringSafeValue(input: any): any {
    if (typeof input === 'string') {
      return input;
    }
    return input.changingThisBreaksApplicationSecurity;
  }

  /*
   * Replaces the match (which should be the default icon) with an icon that
   * indicates the status contained in linkData.
   */
  replaceLink(linkData: any): void {
    this.content = this.wrapStringSafeValue(
      this.unwrapStringSafeValue(this.content)
        .split(linkData.match)
        .join(
          // tslint:disable-next-line:max-line-length
          (linkData.state === 'open'
            ? '<span class="fa fa-clock-o gh-link-open" tooltip="Issue Open"></span>'
            : '') +
            // tslint:disable-next-line:max-line-length
            (linkData.state === 'closed'
              ? '<span class="fa fa-check gh-link-closed" tooltip="Issue Closed"></span>'
              : '') +
            (linkData.state !== 'open' && linkData.state !== 'closed'
              ? // tslint:disable-next-line:max-line-length
                '<span class="fa pficon-warning-triangle-o gh-link-error" tooltip="Issue State Unknown"></span>'
              : ''),
        ),
    );
  }

  /*
   * This does a preliminary synchonous replacement of the original html link with
   * a formatted version and an "unknown status" icon. This first step is needed to
   * not "flash" the original links in the field before updating the icons. In the
   * next step (in updateLinks()), the "unknown status" icon is replaced with the
   * actual status icon.
   */
  updateLinkTexts(): void {
    // the following regexp only matches a specific way of links, namely links with no
    // additional classes etc.; if a markdown compiler (or some other content source)
    // creates different links to GitHub, this regexp needs to be extended to match
    // those formats.
    let thisContent = this.unwrapStringSafeValue(this.content);
    const regexp: RegExp = new RegExp(
      '<a href="https://github.com/([^/]+)/([^/]+)/issues/([^"]+)[^<]*">([^<]+)</a>',
      'gi',
    );
    let result = regexp.exec(thisContent);
    while (result) {
      thisContent = thisContent
        .split(result[0])
        .join(
          `<a class="gh-link" href="https://github.com/${result[1]}/${result[2]}/` +
            `issues/${result[3]}" rel="nofollow">` +
            `<span class="fa fa-github gh-link-system"></span><span class="gh-link-label"> ${
              result[2]
            }:${result[3]} ` +
            `<span ` +
            `data-gh-org="${result[1]}" ` +
            `data-gh-repo="${result[2]}" ` +
            `data-gh-issue="${result[3]}" ` +
            `class="pficon pficon-warning-triangle-o gh-link-error"></span>` +
            `</a>`,
        );
      result = regexp.exec(thisContent);
    }
    this.content = this.wrapStringSafeValue(thisContent);
  }

  /*
   * This updates the icons asynchonously and only replaces the "unknown status" icon
   * with the actual icon matching the remote status. The data is retrieved using the
   * GitHubLinkService to use caching.
   */
  updateLinks(): void {
    const thisContent = this.unwrapStringSafeValue(this.content);
    const regexp: RegExp = new RegExp(
      // tslint:disable-next-line:max-line-length
      '<span data-gh-org="([^"]+)" data-gh-repo="([^"]+)" data-gh-issue="([^"]+)" class="pficon pficon-warning-triangle-o gh-link-error"></span>',
      'gi',
    );
    let result = regexp.exec(thisContent);
    while (result) {
      const thisLinkData = {
        match: result[0],
        org: result[1],
        repo: result[2],
        issue: result[3],
        state: 'error',
      };
      this.gitHubLinkService.getIssue(thisLinkData).subscribe((data) => {
        thisLinkData.state = data.state;
        this.replaceLink(thisLinkData);
      });
      result = regexp.exec(thisContent);
    }
  }
}
