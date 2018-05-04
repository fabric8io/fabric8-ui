import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WindowService } from 'app/shared/window.service';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dialog } from 'ngx-widgets';
import { Subscription } from 'rxjs';
import { CheService } from '../services/che.service';
import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';
import { WorkspacesService } from '../services/workspaces.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-actions',
  templateUrl: './codebases-item-actions.component.html',
  styleUrls: ['./codebases-item-actions.component.less']
})
export class CodebasesItemActionsComponent implements OnDestroy, OnInit {
  @Input() cheRunning: boolean;
  @Input() codebase: Codebase;
  @Input() index: number = -1;
  @ViewChild(ModalDirective) modal: ModalDirective;

  subscriptions: Subscription[] = [];
  workspaceBusy: boolean = false;
  dialog: Dialog;

  constructor(
      private broadcaster: Broadcaster,
      private notifications: Notifications,
      private windowService: WindowService,
      private cheService: CheService,
      private workspacesService: WorkspacesService,
      private codebasesService: CodebasesService) {
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
    this.subscriptions.push(this.cheService.getState().switchMap(che => {
      if (!che.clusterFull) {
        // create
        return this.workspacesService
          .createWorkspace(this.codebase.id)
          .map(workspaceLinks => {
            this.workspaceBusy = false;
            if (workspaceLinks != undefined) {
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
            } else {
              // display error message
              this.notifications.message({
                message: `Workspace error during creation.`,
                type: NotificationType.DANGER
              } as Notification);
            }
          });
      } else {
        // display error message
        this.notifications.message({
          message: `Workspace capacity is reached, new workspace cannot be started.`,
          type: NotificationType.DANGER
        } as Notification);
      }
    }).subscribe());
  }

  /**
   * Confirmation dialog for codebase removal.
   *
   * @param {MouseEvent} event mouse event
   */
  confirmDeleteCodebase(event: MouseEvent): void {
    this.modal.show();
  }

  /**
   * Process the click on confirm dialog button.
   */
  onDeleteCodebase() {
    this.deleteCodebase();
  }

  /**
   * Disassociate codebase from current space
   */
  deleteCodebase(): void {
    this.subscriptions.push(this.codebasesService.deleteCodebase(this.codebase).subscribe((codebase: Codebase) => {
      this.modal.hide();
      this.broadcaster.broadcast('codebaseDeleted', {
        codebase: codebase
      });
    }, (error: any) => {
      this.modal.hide();
      this.handleError('Failed to deleteCodebase codebase ' + this.codebase.name, NotificationType.DANGER);
    }));
  }

  // Private

  /**
   * Get the worksapce name from given URL
   *
   * (e.g., https://che-<username>-che.d800.free-stg.openshiftapps.com/che/quydcbib)
   *
   * @param url The URL used to open a workspace
   * @returns {string} The workspace name (e.g., quydcbib)
   */
  private getWorkspaceName(url: string): string {
    let index = url.lastIndexOf('/') + 1;
    return url.substring(index, url.length);
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
