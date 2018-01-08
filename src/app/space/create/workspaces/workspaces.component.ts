import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  Broadcaster,
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import {
  ActionConfig,
  EmptyStateConfig,
  Filter,
  FilterEvent,
  ListConfig,
  SortEvent,
  SortField
} from 'patternfly-ng';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep } from 'lodash';

import { Che } from '../codebases/services/che';
import { Codebase } from '../codebases/services/codebase';
import { Workspace } from '../codebases/services/workspace';
import { CheService } from '../codebases/services/che.service';
import { CodebasesService } from '../codebases/services/codebases.service';
import { GitHubService } from '../codebases/services/github.service';
import { WorkspacesService } from '../codebases/services/workspaces.service';
import { GitHubRepoDetails } from '../codebases/services/github';

interface IWorkspacesListRow {
  isLastUsed: boolean;
  workspaceName: string;
  codebaseId: string;
  workspace: Workspace;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: [ './workspaces.component.less' ]
})
export class WorkspacesComponent implements OnDestroy, OnInit {

  chePollSubscription: Subscription;
  cheState: Che;
  chePollTimer: Observable<any>;
  subscriptions: Subscription[] = [];
  context: Context;

  codebases: Codebase[] = [];
  workspaces: Workspace[] = [];
  reposByCodebase: Map<string, GitHubRepoDetails> = new Map();
  reposById: Map<number, GitHubRepoDetails> = new Map();
  rows: IWorkspacesListRow[] = [];
  workspacesCount: number = 0;
  resultsCount: number = 0;
  filteredRows: IWorkspacesListRow[];

  listConfig: ListConfig;
  emptyStateConfig: EmptyStateConfig;

  appliedFilters: Filter[];
  currentSortField: SortField;
  isAscendingSort: boolean;

  constructor(
    private broadcaster: Broadcaster,
    private notifications: Notifications,
    private contexts: Contexts,
    private cheService: CheService,
    private codebasesService: CodebasesService,
    private gitHubService: GitHubService,
    private workspacesService: WorkspacesService) {
    this.subscriptions.push(this.contexts.current.subscribe((context: Context) => {
      this.context = context;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.cheState = null;
    this.updateCodebases();
    this.startIdleChe();

    this.emptyStateConfig = {
      actions: {
        primaryActions: [{
          id: 'action1',
          title: 'Create a Workspace',
          tooltip: 'Create a Workspace'
        }],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-add-circle-o',
      title: 'Create a Workspace',
      info: 'Start by creating a workspace.'
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      headingRow: true,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false,
      useHeading: true
    } as ListConfig;

  }

  /**
   * Helper to get repo for codebase.
   * @param {string} codebaseId
   * @returns {string}
   */
  getRepo(codebaseId: string): GitHubRepoDetails {
    return this.reposByCodebase.get(codebaseId);
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.applySort();
  }

  applySort(): void {
    this.filteredRows.sort((row1: IWorkspacesListRow, row2: IWorkspacesListRow) => this.compareRows(row1, row2));
  }

  compareRows(row1: IWorkspacesListRow, row2: IWorkspacesListRow): number {
    let compValue = 0;

    // by default workspaces are sorted by name and last used is the first
    const isDefaultSearch = !this.currentSortField || !this.currentSortField.id;

    if (isDefaultSearch || this.currentSortField.id === 'workspaceName') {
      // by default there is last used workspace should be first
      compValue = (!isDefaultSearch || (!row1.isLastUsed && !row2.isLastUsed)
        ? 0
        : (row1.isLastUsed ? 1 : -1))
        || row1.workspaceName.localeCompare(row2.workspaceName);
    } else if (this.currentSortField.id === 'codebaseName') {
      const repo1 = this.reposByCodebase.get(row1.codebaseId),
        repo2 = this.reposByCodebase.get(row2.codebaseId);
      // by repository name
      compValue = repo1.full_name.localeCompare(repo2.full_name)
        // by workspace name
        || row1.workspaceName.localeCompare(row2.workspaceName);
    }

    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }

    return compValue;
  }

  /**
   * Callback for onFilterChange event.
   *
   * @param {FilterEvent} $event
   */
  filterChange($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
  }

  /**
   * Applies filters to workspaces list.
   *
   * @param {Filter[]} filters
   */
  applyFilters(filters: Filter[]): void {
    this.appliedFilters = filters;
    if (!filters || filters.length === 0) {
      this.filteredRows = cloneDeep(this.rows);
    } else {
      this.filteredRows = this.rows.filter((row: IWorkspacesListRow) => {
        return this.matchesFilters(row, filters);
      });
    }

    this.resultsCount = this.filteredRows.length;
  }

  /**
   * Returns `true` if row matches to all of filters.
   *
   * @param {IWorkspacesListRow} row
   * @param {Filter[]} filters
   * @returns {boolean}
   */
  matchesFilters(row: IWorkspacesListRow, filters: Filter[]): boolean {
    return filters.every(filter => {
      if (filter.field.id === 'workspaceName') {
        return row.workspaceName.match(filter.value) !== null;
      } else if (filter.field.id === 'codebaseName') {
        const repo = this.reposByCodebase.get(row.codebaseId);
        return repo && repo.full_name.match(filter.value) !== null;
      }
      return true;
    });
  }

  /**
   * Update workspaces for codebases.
   */
  private updateCodebases(): void {
    this.subscriptions.push(
      this.codebasesService.getCodebases(this.context.space.id)
        .subscribe(codebases => {
          if (codebases === null) {
            return;
          }
          codebases.forEach(codebase => {
            // get workspace
            this.updateWorkspaces(codebase);

            // get GitHub repo details
            this.updateGitHubRepoDetails(codebase);
          });
        }, error => {
          this.handleError('Failed to retrieve codebases', NotificationType.DANGER);
        })
    );
  }

  /**
   * Helper to update workspaces.
   * @param {Codebase} codebase
   */
  private updateWorkspaces(codebase: Codebase): void {
    this.subscriptions.push(
      this.workspacesService.getWorkspaces(codebase.id)
        .subscribe((workspaces: Workspace[]) => {
          if (workspaces === null || workspaces.length === 0) {
            return;
          }

          this.workspaces = this.workspaces.concat(workspaces);

          workspaces.forEach((workspace: Workspace) => {
            this.rows.push({
              codebaseId: codebase.id,
              isLastUsed: codebase.attributes.last_used_workspace === workspace.attributes.name,
              workspaceName: workspace.attributes.name,
              workspace: workspace
            });
            this.workspacesCount++;
          });
          this.filteredRows = cloneDeep(this.rows);

          this.applyFilters(this.appliedFilters);
          this.applySort();
        }, error => {
          this.handleError('Failed to retrieve workspaces for codebase ID: ' + codebase.id,
            NotificationType.DANGER);
        })
    );
  }

  /**
   * Helper to update GitHub repo details.
   * @param {Codebase} codebase
   */
  private updateGitHubRepoDetails(codebase: Codebase): void {
    this.subscriptions.push(
      this.gitHubService.getRepoDetailsByUrl(codebase.attributes.url)
        .subscribe(gitHubRepoDetails => {
          this.reposByCodebase.set(codebase.id, gitHubRepoDetails);
          this.reposById.set(gitHubRepoDetails.id, gitHubRepoDetails);

          this.applyFilters(this.appliedFilters);
          this.applySort();
        }, _ => {
          this.handleError(`Failed to rerieve GitHub repo: ${codebase.url}`, NotificationType.DANGER);
        })
    );
  }

  /**
   * Helper to poll Che state
   */
  private cheStatePoll(): void {
    // Ensure only one timer is polling
    if (this.chePollSubscription !== undefined && !this.chePollSubscription.closed) {
      this.chePollSubscription.unsubscribe();
    }
    this.chePollTimer = Observable.timer(2000, 20000).take(30);
    this.chePollSubscription = this.chePollTimer
      .switchMap(() => this.cheService.getState())
      .map(che => {
        if (che !== undefined && che.running === true) {
          this.chePollSubscription.unsubscribe();
          this.cheState = che;
        }
      })
      .publish()
      .connect();
    this.subscriptions.push(this.chePollSubscription);
  }

  /**
   * Start the Che server
   */
  private startChe(): void {
    // Get state for Che server
    this.subscriptions.push(this.cheService.start()
      .subscribe(che => {
        this.cheState = che;
        if (che === undefined || che.running !== true) {
          this.cheStatePoll();
        }
      }, error => {
        this.cheState = null;
      }));
  }

  /**
   * Test the Che server state and start if necessary
   */
  private startIdleChe(): void {
    // Get state for Che server
    this.subscriptions.push(this.cheService.getState()
      .subscribe(che => {
        if (che !== undefined && che.running === true) {
          this.cheState = che;
        } else {
          this.startChe();
        }
      }, error => {
        this.cheState = null;
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

}
