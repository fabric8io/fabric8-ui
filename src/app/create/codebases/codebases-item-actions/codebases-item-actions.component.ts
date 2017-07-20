import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Codebase } from '../services/codebase';
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-actions',
  templateUrl: './codebases-item-actions.component.html',
  styleUrls: ['./codebases-item-actions.component.less']
})
export class CodebasesItemActionsComponent implements OnDestroy, OnInit {
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  subscriptions: Subscription[] = [];
  workspaceBusy: boolean = false;

  constructor(
      private broadcaster: Broadcaster,
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
  }

  // Actions

  /**
   * Create workspace and open in editor
   */
  createAndOpenWorkspace(): void {
    this.workspaceBusy = true;
    this.subscriptions.push(this.workspacesService.createWorkspace(this.codebase.id)
      .subscribe(workspaceLinks => {
        this.workspaceBusy = false;
        if (workspaceLinks != null) {
          let name = this.getWorkspaceName(workspaceLinks.links.open);
          this.windowService.open(workspaceLinks.links.open, name);

          this.notifications.message({
            message: `Workspace created!`,
            type: NotificationType.SUCCESS
          } as Notification);

          // Poll for new workspaces
          this.broadcaster.broadcast('workspaceCreated', {
            codebase: this.codebase,
            workspaceName: name
          });
        }
      }, error => {
        this.workspaceBusy = false;
        this.handleError("Failed to create workspace", NotificationType.DANGER);
      }));
  }

  /**
   * Disassociate codebase from current space
   */
  deleteCodebase(): void {
    // Todo: Not yet supported by API
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
  private getWorkspaceName(url: string): string {
    let index = url.lastIndexOf("/") + 1;
    return url.substring(index, url.length);
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
