import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Che } from '../services/che';
import { Codebase } from '../services/codebase';
import { GitHubService } from '../services/github.service';
import { Notification, NotificationType, Notifications } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item',
  templateUrl: './codebases-item.component.html'
})
export class CodebasesItemComponent implements OnDestroy, OnInit {
  @Input() cheState: Che;
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  createdDate: string;
  fullName: string;
  lastCommitDate: string;
  htmlUrl: string;
  subscriptions: Subscription[] = [];

  constructor(
      private gitHubService: GitHubService,
      private notifications: Notifications) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.codebase === undefined || this.codebase.attributes === undefined) {
      return;
    }
    if (this.codebase.attributes.type === 'git') {
      if (!this.isGitHubHtmlUrlInvalid()) {
        this.updateGitHubRepoDetails();
      } else {
        this.handleError(`Invalid URL: ${this.codebase.attributes.url}`, NotificationType.WARNING);
      }
    }
  }

  // Private

  /**
   * Helper to test if codebase contains a valid GitHub HTML URL
   *
   * @returns {boolean}
   */
  private isGitHubHtmlUrlInvalid(): boolean {
    return (this.codebase.attributes.url === undefined
      || this.codebase.attributes.url.trim().length === 0
      || this.codebase.attributes.url.indexOf("https://github.com") === -1
      || this.codebase.attributes.url.indexOf(".git") === -1);
  }

  /**
   * Helper to test if codebase contains a valid HTML URL based on type
   *
   * @returns {boolean}
   */
  private isHtmlUrlInvalid(): boolean {
    if (this.codebase.attributes.type === 'git') {
      return this.isGitHubHtmlUrlInvalid();
    } else {
      return false;
    }
  }

  /**
   * Helper to update GitHub repo details
   */
  private updateGitHubRepoDetails(): void {
    this.subscriptions.push(this.gitHubService.getRepoDetailsByUrl(this.codebase.attributes.url)
      .subscribe(gitHubRepoDetails => {
        this.createdDate = gitHubRepoDetails.created_at;
        this.fullName = gitHubRepoDetails.full_name;
        this.lastCommitDate = gitHubRepoDetails.pushed_at;
        this.htmlUrl = gitHubRepoDetails.html_url;

        // Save for filter
        this.codebase.gitHubRepo = {};
        this.codebase.gitHubRepo.createdAt = gitHubRepoDetails.created_at;
        this.codebase.gitHubRepo.pushedAt = gitHubRepoDetails.pushed_at;
      }, error => {
        this.handleError(`Failed to retrieve GitHub repo: ${this.codebase.attributes.url}`, NotificationType.WARNING);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
