import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { Che } from '../services/che';
import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { Dialog } from 'ngx-widgets';
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

  cheRunning: boolean = false;
  subscriptions: Subscription[] = [];
  workspaceBusy: boolean = false;
  dialog: Dialog;
  showDialog = false;

  constructor(
      private broadcaster: Broadcaster,
      private notifications: Notifications,
      private windowService: WindowService,
      private workspacesService: WorkspacesService,
      private codebasesService: CodebasesService) {
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
        if (che !== undefined && che.running === true) {
          this.cheRunning = true;
        }
      }));
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
   * Confirmation dialog for codebase removal.
   *
   * @param {MouseEvent} event mouse event
   */
  confirmDeleteCodebase(event: MouseEvent): void {
    event.stopPropagation();
    this.dialog = {
      'title': 'Confirm codebase deletion',
      'message': 'Are you sure you want to deleteCodebase codebase?',
      'actionButtons': [
        {'title': 'Confirm', 'value': 1, 'default': false},
        {'title': 'Cancel', 'value': 0, 'default': true}
      ]
    } as Dialog;
    this.showDialog = true;
  }

  /**
   * Process the click on confirm dialog button.
   *
   * @param {number} value
   */
  onDialogButtonClick(value: number) {
    // callback from the confirm deleteCodebase dialog
    if (value === 1) {
      this.deleteCodebase();
    }
    this.showDialog = false;
  }

  /**
   * Disassociate codebase from current space
   */
  deleteCodebase(): void {
    this.subscriptions.push(this.codebasesService.deleteCodebase(this.codebase).subscribe((codebase: Codebase) => {
      this.broadcaster.broadcast('codebaseDeleted', {
        codebase: codebase
      });
    }, (error: any) => {
      this.handleError('Failed to deleteCodebase codebase ' + this.codebase.name, NotificationType.DANGER);
    }));
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
