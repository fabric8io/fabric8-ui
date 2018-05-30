import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';

import { WindowService } from '../../../../shared/window.service';
import { CheService } from '../services/che.service';
import { Codebase } from '../services/codebase';
import { Workspace } from '../services/workspace';
import { WorkspacesService } from '../services/workspaces.service';

export class WorkspaceCreatedEvent {
  codebase: Codebase;
  workspaceName: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-workspaces',
  templateUrl: './codebases-item-workspaces.component.html',
  styleUrls: ['./codebases-item-workspaces.component.less']
})
export class CodebasesItemWorkspacesComponent implements OnDestroy, OnInit {
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  subscriptions: Subscription[] = [];
  workspaceBusy: boolean = false;
  workspaceSelected: boolean = false;
  workspaceUrl: string = 'default';
  workspaces: Workspace[];
  workspacesAvailable: boolean = false;
  workspacePollSubscription: Subscription;
  workspacePollTimer: Observable<any>;

  constructor(
      private broadcaster: Broadcaster,
      private notifications: Notifications,
      private windowService: WindowService,
      private cheService: CheService,
      private workspacesService: WorkspacesService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.workspaceBusy = false;
    this.workspacesAvailable = false;

    if (this.codebase === undefined) {
      return;
    }
    this.workspaces = [];
    this.updateWorkspaces();
    this.broadcaster.on('workspaceCreated')
      .subscribe((val) => {
        if ((val as WorkspaceCreatedEvent).codebase.id === this.codebase.id) {
          this.updateWorkspacesPoll((val as WorkspaceCreatedEvent).workspaceName);
        }
      });
  }

  // Actions

  /**
   * Create workspace
   */
  createWorkspace(): void {
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
              this.notifications.message({
                message: `Workspace created!`,
                type: NotificationType.SUCCESS
              } as Notification);
              // Poll for new workspaces
              this.updateWorkspacesPoll(name);
            } else {
              // display error message
              this.notifications.message({
                message: `Workspace error during creation.`,
                type: NotificationType.DANGER
              } as Notification);
            }
          });
      } else {
        this.workspaceBusy = false;
        this.workspacesAvailable = false;
        // display error message
        this.notifications.message({
          message: `OpenShift Online cluster is currently out of capacity, workspace cannot be started.`,
          type: NotificationType.DANGER
        } as Notification);
        return Observable.of({});
      }
    }).subscribe(() => {},
      err => {
        this.notifications.message({
          message: `Workspace error during creation.`,
          type: NotificationType.DANGER
        } as Notification);
      }));
  }

  /**
   * Disassociate codebase from current space
   */
  deleteCodebase(): void {
    // Todo: Not yet supported by API
  }

  /**
   * Opens Eclipse Che workspace in a new tab
   */
  openWorkspace(): void {
    let workspaceWindow = this.windowService.open('about:blank', '_blank');
    this.workspaceBusy = true;
    this.subscriptions.push(this.cheService.getState().switchMap(che => {
      if (!che.clusterFull) {
        // create
        return this.workspacesService.openWorkspace(this.workspaceUrl).map(workspaceLinks => {
          this.workspaceBusy = false;
          if (workspaceLinks != undefined) {
            workspaceWindow.location.href = workspaceLinks.links.open;
          }
        });
      } else {
        this.workspaceBusy = false;
        // display error message
        this.notifications.message({
          message: `OpenShift Online cluster is currently out of capacity, workspace cannot be started.`,
          type: NotificationType.DANGER
        } as Notification);
        return Observable.of({});
      }
    }).subscribe(() => {},
      err => {
        this.workspaceBusy = false;
        this.handleError('Failed to open workspace', NotificationType.DANGER);
      }));
  }

  /**
   * When combobox element is selected, sets the selected workspace
   */
  setWorkspaceSelected(): void {
    this.workspaceSelected = (this.workspaceUrl !== undefined && this.workspaceUrl.length !== 0
      && this.workspaceUrl !== 'default');
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
  getWorkspaceName(url: string): string {
    let index = url.lastIndexOf('/') + 1;
    return url.substring(index, url.length);
  }

  /**
   * Helper to set flag indicating workspaces are available
   */
  private setWorkspacesAvailable(): void {
    this.workspacesAvailable = (this.workspaces !== undefined && this.workspaces.length !== 0);
  }

  /**
   * Helper to set latest workspace URL based on given name
   *
   * @param name
   */
  private setWorkspaceUrl(name: string): void {
    for (let i = 0; i < this.workspaces.length; i++) {
      if (name === this.workspaces[i].attributes.name) {
        this.workspaceUrl = this.workspaces[i].links.open;
      }
    }
    this.setWorkspaceSelected();
  }

  /**
   * Helper to update workspaces
   */
  private updateWorkspaces(): void {
    this.subscriptions.push(this.workspacesService.getWorkspaces(this.codebase.id)
      .subscribe(workspaces => {
        if (workspaces != undefined && workspaces.length > 0) {
          this.workspaces = workspaces;
          this.setWorkspacesAvailable();
          this.setWorkspaceUrl(this.codebase.attributes.last_used_workspace);
        }
      }, error => {
        console.log('Failed to retrieve workspaces for codebase ID: ' + this.codebase.id);
      }));
  }

  /**
   * Helper to poll for new workspaces
   *
   * Note: Workspaces are not available until they are started in Che. Should Che fail fail to start the workspace,
   * the workspace won't be available to list.
   *
   * @param name The workspace name, if availble
   */
  private updateWorkspacesPoll(name: string): void {
    // Ensure only one timer is polling
    if (this.workspacePollSubscription !== undefined && !this.workspacePollSubscription.closed) {
      this.workspacePollSubscription.unsubscribe();
    }
    this.workspacePollTimer = Observable.timer(2000, 20000).take(30);
    this.workspacePollSubscription = this.workspacePollTimer
      .switchMap(() => this.workspacesService.getWorkspaces(this.codebase.id))
      .map(workspaces => {
        if (workspaces != undefined && workspaces.length > 0
            && workspaces.length !== this.workspaces.length) {
          this.workspacePollSubscription.unsubscribe();
          this.workspaces = workspaces;
          this.setWorkspacesAvailable();
          this.setWorkspaceUrl(name);
        }
      })
      .publish()
      .connect();
    this.subscriptions.push(this.workspacePollSubscription);
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
