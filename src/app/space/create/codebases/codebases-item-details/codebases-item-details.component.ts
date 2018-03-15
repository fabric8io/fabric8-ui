import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Context, Contexts } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs';

import { Codebase } from '../services/codebase';
import { GitHubService } from '../services/github.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-details',
  templateUrl: './codebases-item-details.component.html'
})
export class CodebasesItemDetailsComponent implements OnDestroy, OnInit {
  @Input() codebase: Codebase;

  context: Context;
  filesChanged: number;
  gitUrl: string;
  lastCommit: string;
  license: string;
  subscriptions: Subscription[] = [];

  constructor(
    private contexts: Contexts,
    private gitHubService: GitHubService
    ) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.codebase == undefined || !this.codebase.gitHubRepo || this.codebase.attributes.type !== 'git') {
      return;
    }
    this.subscriptions.push(this.gitHubService.getRepoDetailsByUrl(this.codebase.attributes.url)
      .subscribe(gitHubRepoDetails => {
        this.codebase.gitHubRepo = {};
        this.codebase.gitHubRepo.htmlUrl = gitHubRepoDetails.html_url;
        this.codebase.gitHubRepo.fullName = gitHubRepoDetails.full_name;
        this.codebase.gitHubRepo.createdAt = gitHubRepoDetails.created_at;
        this.codebase.gitHubRepo.pushedAt = gitHubRepoDetails.pushed_at;
        this.gitUrl = gitHubRepoDetails.git_url;

        this.subscriptions.push(this.gitHubService.getRepoLastCommitByUrl(this.codebase.attributes.url)
          .subscribe(gitHubRepoLastCommit => {
            this.lastCommit = gitHubRepoLastCommit.object.sha;
            this.subscriptions.push(this.gitHubService
              .getRepoCommitStatusByUrl(this.codebase.attributes.url, this.lastCommit)
              .subscribe(gitHubRepoCommitStatus => {
                this.filesChanged = gitHubRepoCommitStatus.files.length;
              }, error => {
                // no-op
              }));
          }, error => {
            // no-op
          }));
        this.subscriptions.push(this.gitHubService.getRepoLicenseByUrl(this.codebase.attributes.url)
          .subscribe(gitHubRepoLicense => {
            this.license = gitHubRepoLicense.license.name;
          }, error => {
            this.license = 'None';
          }));
      }, error => {
        this.codebase.gitHubRepo = undefined;
      }));
  }

  // Private

  private isGitHubHtmlUrlInvalid(): boolean {
    return (this.codebase.attributes.url === undefined
      || this.codebase.attributes.url.trim().length === 0
      || this.codebase.attributes.url.indexOf('https://github.com') === -1
      || this.codebase.attributes.url.indexOf('.git') === -1);
  }

  private isHtmlUrlInvalid(): boolean {
    if (this.codebase.attributes.type === 'git') {
      return this.isGitHubHtmlUrlInvalid();
    } else {
      false;
    }
  }
}
