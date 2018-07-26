import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';

const hljs = require('highlight.js');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

@Component({
  selector: 'app-include-markdown',
  template: `
    <div [innerHTML]="templateContent"></div>
  `
})
export class IncludeMarkdownComponent implements OnInit {
  @Input('src') templateUrl: string;

  templateContent: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.templateUrl, { responseType: 'text' }).subscribe((out: any) => {
      this.templateContent = md.render(out);
    });
  }
}
