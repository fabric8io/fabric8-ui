import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Codebase } from '../services/codebase';
import { Notification, NotificationType, Notifications } from 'ngx-base';
import { WorkspacesService } from '../services/workspaces.service';
import { Workspace } from '../services/workspace';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-actions',
  templateUrl: './codebases-item-actions.component.html',
  styleUrls: ['./codebases-item-actions.component.scss'],
  providers: [WorkspacesService]
})
export class CodebasesItemActionsComponent implements OnInit {
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  workspaceUrl: string = "default";
  workspaceUrlInvalid: boolean = true;
  workspaces: Workspace[];

  constructor(
      private notifications: Notifications,
      private workspacesService: WorkspacesService) {
  }

  ngOnInit() {
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
    this.workspacesService.createWorkspace(this.codebase.id).subscribe(workspaceLinks => {
      if (workspaceLinks != null) {
        this.workspaceUrl = workspaceLinks.open; // Make this the current selection

        this.notifications.message({
          message: `Workspace created!`,
          type: NotificationType.SUCCESS
        } as Notification);

        this.openWorkspace();
        this.updateWorkspaces(); // Get newly created workspace
      }
    }, error => {
      this.handleError("Failed to create workspace", NotificationType.DANGER);
    });
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
    this.workspacesService.openWorkspace(this.workspaceUrl).subscribe(workspaceLinks => {
      if (workspaceLinks != null) {
        window.open(workspaceLinks.open);
      }
    }, error => {
      this.handleError("Failed to open workspace", NotificationType.DANGER);
    });
  }

  /**
   * Validate workspace URL upon dropdown selection
   */
  validateWorkspaceUrl(): void {
    this.workspaceUrlInvalid = this.isWorkspaceUrlInvalid();
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
    this.workspacesService.getWorkspaces(this.codebase.id).subscribe(workspaces => {
      if (workspaces != null) {
        this.workspaces = workspaces;
        this.workspaceUrl = "default";
      }
    }, error => {
      this.handleError("Failed to retrieve workspaces", NotificationType.DANGER);
    });
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
