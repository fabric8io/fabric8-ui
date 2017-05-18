import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Codebase } from '../services/codebase';
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { Workspace } from '../services/workspace';

export class WorkspaceCreatedEvent {
  codebase: Codebase;
  workspaceName: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-workspaces',
  templateUrl: './codebases-item-workspaces.component.html',
  styleUrls: ['./codebases-item-workspaces.component.scss']
})
export class CodebasesItemWorkspacesComponent implements OnDestroy, OnInit {
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  subscriptions: Subscription[] = [];
  workspaceBusy: boolean = false;
  workspaceSelected: boolean = false;
  workspaceUrl: string = "default";
  workspaces: Workspace[];
  workspacesAvailable: boolean = false;
  workspacePollSubscription: Subscription;
  workspacePollTimer: Observable<any>;

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
    if (this.codebase === undefined) {
      return;
    }
    this.workspaces = [];
    this.updateWorkspaces();
    this.workspacePollTimer = Observable.timer(3000, 30000).take(10);
    this.broadcaster.on('workspaceCreated')
      .subscribe((val) => {
        if ((val as WorkspaceCreatedEvent).codebase.id === this.codebase.id) {
          this.updateWorkspacesPoll((val as WorkspaceCreatedEvent).workspaceName);
        }
      });
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
          this.updateWorkspacesPoll(name);
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

  /**
   * Open workspace in editor
   */
  openWorkspace(): void {
    this.workspaceBusy = true;
    this.subscriptions.push(this.workspacesService.openWorkspace(this.workspaceUrl)
      .subscribe(workspaceLinks => {
        this.workspaceBusy = false;
        if (workspaceLinks != null) {
          this.windowService.open(workspaceLinks.links.open, this.getWorkspaceName(workspaceLinks.links.open));
        }
      }, error => {
        this.workspaceBusy = false;
        this.handleError("Failed to open workspace", NotificationType.DANGER);
      }));
  }

  setWorkspaceSelected(): void {
    this.workspaceSelected = (this.workspaceUrl !== undefined && this.workspaceUrl.length !== 0
      && this.workspaceUrl !== "default");
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
    let index = url.lastIndexOf("/") + 1;
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
        if (workspaces != null && workspaces.length > 0) {
          this.workspaces = workspaces;
          this.setWorkspacesAvailable();
          this.setWorkspaceUrl(this.codebase.attributes.last_used_workspace);
        }
      }, error => {
        // Do nothing
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
    this.workspacePollSubscription = this.workspacePollTimer
      .switchMap(() => this.workspacesService.getWorkspaces(this.codebase.id))
      .map(workspaces => {
        if (workspaces != null && workspaces.length > 0
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
