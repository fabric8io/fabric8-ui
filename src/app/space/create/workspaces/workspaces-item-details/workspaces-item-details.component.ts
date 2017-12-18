import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { GitHubRepoDetails } from '../../codebases/services/github';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'workspaces-item-details',
  templateUrl: './workspaces-item-details.component.html'
})
export class WorkspacesItemDetailsComponent implements OnDestroy, OnInit {
  @Input() repo: GitHubRepoDetails;

  branchName: string;

  ngOnInit(): void {
    // todo: replace dummy branch name with actual one
    this.branchName = this.repo.default_branch;
  }

  ngOnDestroy(): void {
  }

}
