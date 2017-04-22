import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Codebase } from '../services/codebase';
import { Notification, NotificationType, Notifications } from 'ngx-base';
import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { Workspace } from '../services/workspace';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-actions',
  templateUrl: './codebases-item-actions.component.html',
  styleUrls: ['./codebases-item-actions.component.scss'],
  providers: [WindowService, WorkspacesService]
})
export class CodebasesItemActionsComponent implements OnDestroy, OnInit {
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  subscriptions: Subscription[] = [];
  workspaceUrl: string = "default";
  workspaceUrlInvalid: boolean = true;
  workspaces: Workspace[];
  workspacesAvailable: boolean = false;

  constructor(
      private notifications: Notifications,
      private windowService: WindowService,
      private workspacesService: WorkspacesService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.codebase === undefined) {
      return;
    }
    this.updateWorkspaces();
  }

  // Actions

  /**
   * Create workspace and open in editor
   */
  createAndOpenWorkspace(): void {
    this.subscriptions.push(this.workspacesService.createWorkspace(this.codebase.id)
      .subscribe(workspaceLinks => {
        if (workspaceLinks != null) {
          this.windowService.open(workspaceLinks.links.open, this.getWorkspaceName(workspaceLinks.links.open));

          this.notifications.message({
            message: `Workspace created!`,
            type: NotificationType.SUCCESS
          } as Notification);

          // Todo: Cannot update workspaces after creating a new one -- Che takes too long.
          //this.updateWorkspaces();
        }
      }, error => {
        this.handleError("Failed to create workspace", NotificationType.DANGER);
      }));
  }

  /**
   * Disassociate codebase from current space
   */
  deleteCodebase(): void {
    // Todo: Not yet supported by API
  }

  /**
   * Open workspace in editor
   */
  openWorkspace(): void {
    this.subscriptions.push(this.workspacesService.openWorkspace(this.workspaceUrl)
      .subscribe(workspaceLinks => {
        if (workspaceLinks != null) {
          this.windowService.open(workspaceLinks.links.open, this.getWorkspaceName(workspaceLinks.links.open));
        }
      }, error => {
        this.handleError("Failed to open workspace", NotificationType.DANGER);
      }));
  }

  /**
   * Validate workspace URL upon dropdown selection
   */
  validateWorkspaceUrl(): void {
    this.workspaceUrlInvalid = this.isWorkspaceUrlInvalid();
  }

  // Private

  /**
   * Get the worksapce name from given URL
   *
   * (e.g., https://che-<username>-che.d800.free-int.openshiftapps.com/che/quydcbib)
   *
   * @param url The URL used to open a workspace
   * @returns {string} The workspace name (e.g., quydcbib)
   */
  getWorkspaceName(url: string): string {
    let index = url.lastIndexOf("/");
    return url.substring(index, url.length);
  }

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
   * Helper to test if workspace URL is valid
   *
   * @returns {boolean}
   */
  private isWorkspaceUrlInvalid(): boolean {
    let result = (this.workspaceUrl === undefined
      || this.workspaceUrl.trim().length === 0
      || this.workspaceUrl === "default");
    return result;
  }

  /**
   * Helper to update workspaces
   */
  private updateWorkspaces(): void {
    this.workspacesAvailable = false;
    this.subscriptions.push(this.workspacesService.getWorkspaces(this.codebase.id)
      .subscribe(workspaces => {
        if (workspaces != null && workspaces.length > 0) {
          this.workspaces = workspaces;
          this.workspacesAvailable = true;
        }
      }, error => {
        this.handleError("Failed to retrieve workspaces", NotificationType.WARNING);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
