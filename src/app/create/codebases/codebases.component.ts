import { Component, ContentChild, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Codebase } from './services/codebase';
import { CodebasesService } from './services/codebases.service';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { GitHubService } from "./services/github.service";
import { Broadcaster, Notification, NotificationType, Notifications } from 'ngx-base';

import { cloneDeep } from 'lodash';

import {
  EmptyStateConfig,
  Filter,
  FilterEvent,
  ListViewConfig,
  SortEvent,
  SortField
} from 'ngx-widgets';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases',
  templateUrl: './codebases.component.html',
  styleUrls: ['./codebases.component.less'],
  providers: [CodebasesService, DatePipe, GitHubService]
})
export class CodebasesComponent implements OnDestroy, OnInit {
  @ContentChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ContentChild('itemTemplate') itemTemplate: TemplateRef<any>;
  @ContentChild('itemExpandedTemplate') itemExpandedTemplate: TemplateRef<any>;

  allCodebases: Codebase[];
  appliedFilters: Filter[];
  codebases: Codebase[];
  context: Context;
  currentSortField: SortField;
  emptyStateConfig: EmptyStateConfig;
  isAscendingSort: boolean = true;
  listViewConfig: ListViewConfig;
  resultsCount: number = 0;
  subscriptions: Subscription[] = [];

  constructor(
      private broadcaster: Broadcaster,
      private codebasesService: CodebasesService,
      private contexts: Contexts,
      private datePipe: DatePipe,
      private gitHubService: GitHubService,
      private notifications: Notifications,
      private router: Router) {
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
    this.gitHubService.clearCache();
    this.subscriptions.push(this.broadcaster
      .on('codebaseAdded')
      .subscribe((codebase: Codebase) => {
        this.addCodebase(codebase);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.updateCodebases();

    this.emptyStateConfig = {
      actions: [{
        id: 'action1',
        name: 'Add a Codebase',
        title: 'Add a Codebase',
        type: 'main'
      }],
      icon: 'pficon-add-circle-o',
      title: 'Add a Codebase',
      info: "Start by importing your code repository."
    } as EmptyStateConfig;

    this.listViewConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      headingRow: true,
      multiSelect: false,
      selectItems: false,
      //selectionMatchProp: 'name',
      showSelectBox: false,
      useExpandingRows: true
    } as ListViewConfig;
  }

  // Actions

  openAddCodebasePanel(): void {
    this.router.navigate([`${this.context.path}/create`, { outlets: { action: 'add-codebase' }}]);
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
    this.codebases.unshift({} as Codebase); // Add empty object for row header
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
    } else if (filter.field.id === "pushedAt") {
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
   * Update latest codebases for current space
   */
  private updateCodebases(): void {
    // Get codebases
    this.subscriptions.push(this.codebasesService.getCodebases(this.context.space.id)
      .subscribe(codebases => {
        if (codebases != null) {
          this.allCodebases = codebases;
          this.codebases = cloneDeep(codebases);
          this.codebases.unshift({} as Codebase); // Add empty object for row header
        }
      }, error => {
        this.handleError("Failed to retrieve codebases", NotificationType.DANGER);
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
