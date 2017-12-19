import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Che } from './services/che';
import { CheService } from './services/che.service';
import { Codebase } from './services/codebase';
import { CodebasesService } from './services/codebases.service';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { GitHubService } from './services/github.service';
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { cloneDeep } from 'lodash';

import {
  ActionConfig,
  EmptyStateConfig,
  Filter,
  FilterEvent,
  ListConfig,
  SortEvent,
  SortField
} from 'patternfly-ng';
import { ProviderService } from '../../../shared/account/provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases',
  templateUrl: './codebases.component.html',
  styleUrls: ['./codebases.component.less'],
  providers: [CheService, CodebasesService, DatePipe, GitHubService]
})
export class CodebasesComponent implements OnDestroy, OnInit {
  allCodebases: Codebase[];
  appliedFilters: Filter[];
  chePollSubscription: Subscription;
  chePollTimer: Observable<any>;
  cheState: Che;
  codebases: Codebase[] = [];
  context: Context;
  currentSortField: SortField;
  emptyStateConfig: EmptyStateConfig;
  isAscendingSort: boolean = true;
  listConfig: ListConfig;
  resultsCount: number = 0;
  subscriptions: Subscription[] = [];
  gitHubConnected: boolean;
  disconnectedStateConfig: EmptyStateConfig;

  constructor(
      private broadcaster: Broadcaster,
      private cheService: CheService,
      private codebasesService: CodebasesService,
      private contexts: Contexts,
      private datePipe: DatePipe,
      private gitHubService: GitHubService,
      private notifications: Notifications,
      private authenticationService: AuthenticationService,
      private router: Router,
      private providerService: ProviderService) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
    this.gitHubService.clearCache();
    this.subscriptions.push(this.broadcaster
      .on('codebaseAdded')
      .subscribe((codebase: Codebase) => {
        this.updateCodebases();
      }));

    this.subscriptions.push(this.broadcaster
      .on('codebaseDeleted')
      .subscribe(() => {
        this.updateCodebases();
      }));

    this.subscriptions.push(this.authenticationService.gitHubToken.subscribe((response) => {
      if (response) {
        this.gitHubConnected = true;
      } else {
        this.gitHubConnected = false;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    if (this.gitHubConnected) {
      this.cheState = {running: false, multiTenant: false};
      this.updateCodebases();
      this.startIdleChe();

      this.emptyStateConfig = {
        actions: {
          primaryActions: [{
            id: 'action1',
            title: 'Add a Codebase',
            tooltip: 'Add a Codebase'
          }],
          moreActions: []
        } as ActionConfig,
        iconStyleClass: 'pficon-add-circle-o',
        title: 'Add a Codebase',
        info: 'Start by importing your code repository.'
      } as EmptyStateConfig;

      this.listConfig = {
        dblClick: false,
        emptyStateConfig: this.emptyStateConfig,
        headingRow: true,
        multiSelect: false,
        selectItems: false,
        //selectionMatchProp: 'name',
        showCheckbox: false,
        useExpandItems: true,
        useHeading: true
      } as ListConfig;
    }

    this.disconnectedStateConfig = {
      actions: {
        primaryActions: [{
          id: 'connectAction',
          title: 'Connect to GitHub',
          tooltip: 'Connect to GitHub'
        }],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-info',
      title: 'GitHub Disconnected',
      info: 'You must be connected to GitHub in order to connect or create a Codebase'
    } as EmptyStateConfig;
  }

  // Actions

  openAddCodebasePanel(): void {
    this.router.navigate([`${this.context.path}/create`, { outlets: { action: 'add-codebase' }}]);
  }

  connectToGithub(): void {
    this.providerService.linkGitHub(window.location.href);
  }
  // Filter

  applyFilters(filters: Filter[]): void {
    this.appliedFilters = filters;
    this.codebases = [];
    if (filters && filters.length > 0) {
      this.allCodebases.forEach((codebase) => {
        if (this.matchesFilters(codebase, filters)) {
          this.codebases.push(codebase);
        }
      });
    } else {
      this.codebases = cloneDeep(this.allCodebases);
    }
    this.resultsCount = this.codebases.length;
  }

  filterChange($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(codebase: Codebase, filter: Filter): boolean {
    let match = true;

    if (filter.field.id === 'name') {
      match = codebase.name.match(filter.value) !== null;
    } else if (filter.field.id === 'createdAt') {
      let date = this.datePipe.transform(codebase.gitHubRepo.createdAt, 'medium');
      match = date.match(filter.value) !== null;
    } else if (filter.field.id === 'pushedAt') {
      let date = this.datePipe.transform(codebase.gitHubRepo.pushedAt, 'medium');
      match = date.match(filter.value) !== null;
    }
    return match;
  }

  matchesFilters(codebase: Codebase, filters: Filter[]): boolean {
    let matches = true;

    filters.forEach((filter) => {
      if (!this.matchesFilter(codebase, filter)) {
        matches = false;
        return false;
      }
    });
    return matches;
  }

  // Sort

  compare(codebase1: Codebase, codebase2: Codebase): number {
    var compValue = 0;

    // this is necessary because the first item in the codebases array
    // is an empty object that is needed to create the headers of the table
    if (!Object.keys(codebase1).length || !Object.keys(codebase2).length) {
      return compValue;
    }

    if (this.currentSortField.id === 'name') {
      compValue = codebase1.name.localeCompare(codebase2.name);
    } else if (this.currentSortField.id === 'createdAt') {
      let date1 = new Date(codebase1.gitHubRepo.createdAt); // 2011-04-07T10:12:58Z
      let date2 = new Date(codebase2.gitHubRepo.createdAt);
      compValue = (date1 > date2) ? 1 : -1;
    } else if (this.currentSortField.id === 'pushedAt') {
      let date1 = new Date(codebase1.gitHubRepo.pushedAt);
      let date2 = new Date(codebase2.gitHubRepo.pushedAt);
      compValue = (date1 > date2) ? 1 : -1;
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  sortChange($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.codebases.sort((codebase1: Codebase, codebase2: Codebase) => this.compare(codebase1, codebase2));
  }

  // Private

  /**
   * Add latest codebase
   */
  private addCodebase(codebase: Codebase): void {
    if (this.allCodebases === undefined) {
      this.allCodebases = [];
    }
    this.allCodebases.push(codebase);
    this.applyFilters(this.appliedFilters);
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

  /**
   * Update latest codebases for current space
   */
  private updateCodebases(): void {
    // Get codebases
    this.subscriptions.push(this.codebasesService.getCodebases(this.context.space.id)
      .subscribe(codebases => {
        if (codebases != null && codebases.length > 0) {
          this.allCodebases = codebases;
          this.codebases = cloneDeep(codebases);
          this.codebases.unshift({} as Codebase); // Add empty object for row header
          this.applyFilters(this.appliedFilters);
        } else {
          // clear the codebases list:
          this.allCodebases = [];
          this.codebases = [];
        }
      }, error => {
        this.handleError('Failed to retrieve codebases', NotificationType.DANGER);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
