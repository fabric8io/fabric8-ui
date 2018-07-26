import { HttpClient } from '@angular/common/http';
import {
  Component, Input, OnInit
} from '@angular/core';


@Component({
  selector: 'app-include-content',
  template: `
    <pre><code>{{templateContent}}</code></pre>`
})
export class IncludeContentComponent implements OnInit {
  @Input('src') templateUrl: string;

  page: string;
  templateContent: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.templateUrl, { responseType: 'text' }).subscribe((out: any) => {
      this.templateContent = out;
    });
  }
}
