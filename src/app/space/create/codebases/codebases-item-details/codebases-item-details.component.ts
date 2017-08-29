import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Codebase } from '../services/codebase';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { GitHubService } from "../services/github.service";
import { Logger } from 'ngx-base';

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
  htmlUrl: string;
  subscriptions: Subscription[] = [];

  constructor(
      private contexts: Contexts,
      private gitHubService: GitHubService,
      private logger: Logger) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.codebase == undefined || this.codebase.attributes.type !== 'git') {
      return;
    }
    this.subscriptions.push(this.gitHubService.getRepoDetailsByUrl(this.codebase.attributes.url)
      .subscribe(gitHubRepoDetails => {
        this.gitUrl = gitHubRepoDetails.git_url;
        this.htmlUrl = gitHubRepoDetails.html_url;
      }, error => {
        this.logger.error("Failed to retrieve GitHub repo details");
      }));
    this.subscriptions.push(this.gitHubService.getRepoLastCommitByUrl(this.codebase.attributes.url)
      .subscribe(gitHubRepoLastCommit => {
        this.lastCommit = gitHubRepoLastCommit.object.sha;
        this.subscriptions.push(this.gitHubService
            .getRepoCommitStatusByUrl(this.codebase.attributes.url, this.lastCommit)
          .subscribe(gitHubRepoCommitStatus => {
          this.filesChanged = gitHubRepoCommitStatus.files.length;
        }, error => {
          this.logger.error("Failed to retrieve GitHub status");
        }));
      }, error => {
        this.logger.error("Failed to retrieve GitHub repo last commit");
      }));
    this.subscriptions.push(this.gitHubService.getRepoLicenseByUrl(this.codebase.attributes.url)
      .subscribe(gitHubRepoLicense => {
        this.license = gitHubRepoLicense.license.name;
      }, error => {
        this.license = "None"
      }));
  }

  // Private

  private isGitHubHtmlUrlInvalid(): boolean {
    return (this.codebase.attributes.url === undefined
    || this.codebase.attributes.url.trim().length === 0
    || this.codebase.attributes.url.indexOf("https://github.com") === -1
    || this.codebase.attributes.url.indexOf(".git") === -1);
  }

  private isHtmlUrlInvalid(): boolean {
    if (this.codebase.attributes.type === 'git') {
      return this.isGitHubHtmlUrlInvalid();
    } else {
      false;
    }
  }
}
