import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Che } from '../services/che';
import { Codebase } from '../services/codebase';
import { GitHubService } from "../services/github.service";
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { NotificationType as NotificationTypes } from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item',
  templateUrl: './codebases-item.component.html',
  styleUrls: ['./codebases-item.component.less']
})
export class CodebasesItemComponent implements OnDestroy, OnInit {
  @Input() cheRunning: boolean;
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  cheErrorMessage: string = "Your Workspaces failed to load";
  cheRunningMessage: string = "Your Workspaces have loaded successfully";
  cheStarting: boolean = false;
  cheStartingMessage: string = "Your Workspaces are loading...";
  createdDate: string;
  fullName: string;
  lastCommitDate: string;
  htmlUrl: string;
  notificationMessage: string = this.cheStartingMessage;
  notificationType: string = NotificationTypes.INFO;
  subscriptions: Subscription[] = [];

  constructor(
      private broadcaster: Broadcaster,
      private gitHubService: GitHubService,
      private notifications: Notifications) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.broadcaster
      .on('cheStateChange')
      .subscribe((che: Che) => {
        if (che === undefined) {
          this.notificationMessage = this.cheErrorMessage;
          this.notificationType = NotificationTypes.DANGER;
          this.cheStarting = true;
        } else if (che.running === true) {
          this.notificationMessage = this.cheRunningMessage;
          this.notificationType = NotificationTypes.SUCCESS;
        } else if (che.running === false) {
          this.notificationMessage = this.cheStartingMessage;
          this.notificationType = NotificationTypes.INFO;
          this.cheStarting = true;
        }
      }));
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
