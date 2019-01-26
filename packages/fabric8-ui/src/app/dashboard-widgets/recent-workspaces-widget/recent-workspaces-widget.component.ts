import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Space, Spaces, Team } from 'ngx-fabric8-wit';
import { RelationalData, SpaceAttributes, SpaceLink, SpaceRelationships } from 'ngx-fabric8-wit';
import { forkJoin as observableForkJoin, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ContextService } from '../../shared/context.service';
import { WindowService } from '../../shared/window.service';
import { Codebase } from '../../space/create/codebases/services/codebase';
import { CodebasesService } from '../../space/create/codebases/services/codebases.service';
import { Workspace } from '../../space/create/codebases/services/workspace';
import { WorkspacesService } from '../../space/create/codebases/services/workspaces.service';

// Adds an extra workspaces property
export class ExtCodebase extends Codebase {
  workspaces?: Workspace[];
}

// Adds an extra codebases property
export class ExtSpace implements Space {
  codebases: ExtCodebase[];

  name: string;

  path: String;

  privateSpace?: boolean;

  teams: Team[];

  defaultTeam: Team;

  id: string;

  attributes: SpaceAttributes;

  type: string;

  links: SpaceLink;

  relationships: SpaceRelationships;

  relationalData?: RelationalData;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-recent-workspaces-widget',
  templateUrl: './recent-workspaces-widget.component.html',
  styleUrls: ['./recent-workspaces-widget.component.less'],
})
export class RecentWorkspacesWidgetComponent implements OnDestroy, OnInit {
  codebases: Codebase[] = [];

  contextPath: Observable<string>;

  limit: number = 5;

  // the number of workspaces to display
  loading: boolean = false;

  recent: ExtSpace[];

  subscriptions: Subscription[] = [];

  _workspaces: Workspace[] = [];

  constructor(
    private codebasesService: CodebasesService,
    private contextService: ContextService,
    private notifications: Notifications,
    private spaces: Spaces,
    private windowService: WindowService,
    private workspacesService: WorkspacesService,
  ) {
    // Get workspaces from recent workspaces
    this.subscriptions.push(
      this.fetchRecentSpaces().subscribe((recent: ExtSpace[]) => {
        if (recent !== undefined) {
          this.recent = recent;
          this.initWorkspaces();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {}

  /**
   * Returns a list of workspaces pulled from recent spaces
   *
   * @returns {Workspace[]}
   */
  get workspaces(): Workspace[] {
    return this._workspaces;
  }

  /**
   * Open given workspace in Che editor
   */
  openWorkspace(workspace: Workspace): void {
    let workspaceWindow = this.windowService.open('about:blank', '_blank');
    this.subscriptions.push(
      this.workspacesService.openWorkspace(workspace.links.open).subscribe(
        (workspaceLinks) => {
          if (workspaceLinks != undefined) {
            workspaceWindow.location.href = workspaceLinks.links.open;
          }
        },
        (error) => {
          this.handleError('Failed to open workspace', NotificationType.DANGER);
        },
      ),
    );
  }

  // Private

  /**
   * Helper to fetch the list of codebases for each related workspaces.
   *
   * @returns {Observable<ExtCodebase[]>}
   */
  private fetchCodebases(spaceId: string): Observable<ExtCodebase[]> {
    return this.codebasesService.getCodebases(spaceId).pipe(
      mergeMap((codebases) => {
        if (codebases.length === 0) {
          return observableOf([]);
        }
        return observableForkJoin(
          codebases.map((codebase: ExtCodebase) =>
            this.workspacesService.getWorkspaces(codebase.id).pipe(
              map((workspaces) => {
                codebase.workspaces = workspaces;
                return codebase;
              }),
              catchError((error) => observableOf([])),
            ),
          ),
        );
      }),
    );
  }

  /**
   * Helper to fetch the list of codebases for each recent spaces
   */
  private fetchRecentSpaces(): Observable<ExtSpace[]> {
    if (this.spaces.recent === undefined) {
      return observableOf([]);
    }
    let recentSpaces = this.spaces.recent.pipe(
      switchMap((val) => {
        if (val.length === 0) {
          return observableOf([]);
        }
        return observableForkJoin(
          val.map((space: ExtSpace) => {
            this.loading = true;
            return this.fetchCodebases(space.id).pipe(
              map((codebases) => {
                space.codebases = codebases;
                return space;
              }),
              catchError((error) => observableOf([])),
              tap(() => {
                this.loading = false;
              }),
            );
          }),
        );
      }),
    );
    return recentSpaces;
  }

  /**
   * Helper to handle error messages
   *
   * @param {string} error
   * @param {NotificationType} type
   */
  private handleError(error: string, type: NotificationType): void {
    this.notifications.message({
      message: error,
      type: type,
    } as Notification);
  }

  /**
   * Helper to initialize the list of workspaces pulled from recent spaces
   */
  private initWorkspaces(): void {
    this._workspaces = [];
    for (let c = 0; c < this.recent.length; c++) {
      let space = this.recent[c];
      if (space.codebases === undefined) {
        continue;
      }
      for (let i = 0; i < space.codebases.length; i++) {
        let codebase = space.codebases[i];
        if (!codebase.workspaces) {
          // This could be null
          continue;
        }
        for (
          let k = 0;
          k < codebase.workspaces.length && this._workspaces.length < this.limit;
          k++
        ) {
          this._workspaces.push(codebase.workspaces[k]);
        }
        if (this._workspaces.length === 5) {
          break;
        }
      }
    }
  }
}
