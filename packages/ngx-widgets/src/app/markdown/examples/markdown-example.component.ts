import { Component, ElementRef, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl
} from '@angular/platform-browser';
import markdownIt from 'markdown-it';
const markdown = new markdownIt();

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

 constructor(protected sanitizer: DomSanitizer) {}

 public transform(value: any, type: string):
  SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'markdown-example',
  styleUrls: ['./markdown-example.component.less'],
  templateUrl: './markdown-example.component.html'
})
export class MarkdownExampleComponent {

    private renderedText: string = '<h1>hello, markdown!\</h1><ul>' +
    // tslint:disable-next-line:max-line-length
    '<li><input class="markdown-checkbox" type="checkbox" data-checkbox-index="0"></input> Item 0</li>' +
    // tslint:disable-next-line:max-line-length
    '<li><input class="markdown-checkbox" type="checkbox" checked="" data-checkbox-index="1"></input> Item 1</li>' +
    // tslint:disable-next-line:max-line-length
    '<li><input class="markdown-checkbox" type="checkbox" data-checkbox-index="2"></input> Item 2</li></ul>';
  private renderedTextNoEdit: string = '<p>Edit is not allowed here</p>';
  private rawText: string = '# hello, markdown!\n* [ ] Item 1\n* [x] Item 2\n* [ ] Item 3';
  private allowEdit = false;

  constructor(private sanitizer: DomSanitizer) {}

  onSaveOrPreview(value: any) {
    const rawText = value.rawText;
    const callBack = value.callBack;
    console.log('MarkdownExampleComponent: Received markdown markup update in client: ' + rawText);
    setTimeout(() => {
      let text: string = markdown.render(rawText);
      const regex = /\[[ xX]\]|\[\]/gm;
      let m;
      let matchIndex = 0;
      // tslint:disable-next-line:no-conditional-assignment
      while ((m = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches.
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (m.length > 0) {
          // JavaScript does not have a replace by index method.
          let matchLen = m[0].length;
          let matchEndIndex = regex.lastIndex;
          let matchStartIndex = matchEndIndex - matchLen;
          let replaceStr;
          if (m[0] === '[]' || m[0] === '[ ]') {
            // tslint:disable-next-line:max-line-length
            replaceStr = '<input class="markdown-checkbox" type="checkbox" data-checkbox-index="' + matchIndex + '"></input>';
          } else {
            // tslint:disable-next-line:max-line-length
            replaceStr = '<input class="markdown-checkbox" type="checkbox" checked="" data-checkbox-index="' + matchIndex + '"></input>';
          }
          // tslint:disable-next-line:max-line-length
          text = text.substring(0, matchStartIndex) + replaceStr + text.substring(matchEndIndex, text.length);
        }
        matchIndex++;
      }
      // tslint:disable-next-line:max-line-length
      console.log('MarkdownExampleComponent: Rendering on service side completed, sending to component: ' + text);
      callBack(rawText, this.sanitizer.bypassSecurityTrustHtml(text));
    }, 2000);
  }

  onSaveOrPreviewUndefined(value: any) {
    const rawText = value.rawText;
    const callBack = value.callBack;
    setTimeout(() => {
      callBack(undefined, undefined);
    }, 2000);
  }

  closeClicked() {
    console.log('Close clicked event works');
  }

}
