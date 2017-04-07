import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Codebase } from '../services/codebase';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { GitHubService } from "../services/github.service";
import { Logger } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-details',
  templateUrl: './codebases-item-details.component.html',
  styleUrls: ['./codebases-item-details.component.scss'],
  providers: [GitHubService]
})
export class CodebasesItemDetailsComponent implements OnInit {
  @Input() codebase: Codebase;

  context: Context;
  filesChanged: number;
  gitUrl: string;
  lastCommit: string;
  license: string;
  htmlUrl: string;

  constructor(
      private contexts: Contexts,
      private gitHubService: GitHubService,
      private logger: Logger) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit(): void {
    if (this.codebase == undefined || this.codebase.attributes.type !== 'git') {
      return;
    }
    this.gitHubService.getRepoDetailsByUrl(this.codebase.attributes.url).subscribe(gitHubRepoDetails => {
      this.gitUrl = gitHubRepoDetails.git_url;
      this.htmlUrl = gitHubRepoDetails.html_url;
    }, error => {
      this.logger.error("Failed to retrieve GitHub repo details");
    });
    this.gitHubService.getRepoLastCommitByUrl(this.codebase.attributes.url).subscribe(gitHubRepoLastCommit => {
      this.lastCommit = gitHubRepoLastCommit.object.sha;
      this.gitHubService.getRepoCommitStatusByUrl(this.codebase.attributes.url, this.lastCommit)
        .subscribe(gitHubRepoCommitStatus => {
        this.filesChanged = gitHubRepoCommitStatus.files.length;
      }, error => {
        this.logger.error("Failed to retrieve GitHub status");
      });
    }, error => {
      this.logger.error("Failed to retrieve GitHub repo last commit");
    });
    this.gitHubService.getRepoLicenseByUrl(this.codebase.attributes.url).subscribe(gitHubRepoLicense => {
      this.license = gitHubRepoLicense.license.name;
    }, error => {
      this.license = "None"
    });
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
