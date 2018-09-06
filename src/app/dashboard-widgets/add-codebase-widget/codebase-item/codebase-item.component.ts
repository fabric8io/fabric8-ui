import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

import { Codebase } from '../../../space/create/codebases/services/codebase';
import { GitHubRepoDetails } from '../../../space/create/codebases/services/github';
import { GitHubService } from '../../../space/create/codebases/services/github.service';

@Component({
  selector: 'fabric8-add-codebase-widget-codebase-item',
  templateUrl: './codebase-item.component.html',
  styleUrls: ['./codebase-item.component.less'],
  providers: [GitHubService]
})
export class CodebaseItemComponent implements OnInit {

  @Input() codebase: Codebase;
  lastUpdated$: Observable<string>;

  constructor(
    private readonly githubService: GitHubService
  ) { }

  ngOnInit(): void {
    this.lastUpdated$ = this.githubService
      .getRepoDetailsByUrl(this.codebase.attributes.url)
      .pipe(
        map((details: GitHubRepoDetails): string => details.pushed_at)
      );
  }

}
