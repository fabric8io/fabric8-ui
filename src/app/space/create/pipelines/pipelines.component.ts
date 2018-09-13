import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { Subscription } from 'rxjs';

import { Filter, FilterConfig, FilterEvent, FilterType } from 'patternfly-ng/filter';
import { SortEvent, SortField } from 'patternfly-ng/sort';
import { ToolbarConfig } from 'patternfly-ng/toolbar';

import {
  Context,
  Contexts,
  Space
} from 'ngx-fabric8-wit';
import { BuildConfig } from '../../../../a-runtime-console/index';
import { PipelinesService } from './services/pipelines.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-pipelines',
  templateUrl: 'pipelines.component.html',
  styleUrls: ['./pipelines.component.less'],
  providers: [
    PipelinesService
  ]
})
export class PipelinesComponent implements OnInit, OnDestroy, AfterViewInit {
  toolbarConfig: ToolbarConfig;
  consoleAvailable: boolean = false;
  openshiftConsoleUrl: string;

  private _context: Context;
  private _filteredPipelines: BuildConfig[] = [];
  private _allPipelines: BuildConfig[] = [];
  private _appliedFilters: Filter[] = [];
  private _ascending: boolean;
  private _currentSortField: SortField = {
    id: 'application',
    title: 'Application',
    sortType: 'alpha'
  } as SortField;
  private space: Space;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private contexts: Contexts,
    private pipelinesService: PipelinesService,
    private router: Router,
    private broadcaster: Broadcaster
  ) {
    this.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'application',
            title: 'Application',
            placeholder: 'Filter by Application...',
            type: FilterType.TEXT
          },
          {
            id: 'codebase',
            title: 'Codebase',
            placeholder: 'Filter by Codebase...',
            type: FilterType.TEXT
          }
        ],
        appliedFilters: [],
        resultsCount: this.pipelines.length,
        tooltipPlacement: 'right'
      } as FilterConfig,
      sortConfig: {
        fields: [
          {
            id: 'application',
            title: 'Application',
            sortType: 'alpha'
          },
          {
            id: 'codebase',
            title: 'Codebase',
            sortType: 'alpha'
          }
        ]
      }
    } as ToolbarConfig;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.contexts.current.subscribe((context: Context) => {
        this._context = context;
        this.space = context.space;
      }));

    this.subscriptions.push(
      this.pipelinesService.getCurrentPipelines()
        .subscribe((buildConfigs: BuildConfig[]) => {
          this._allPipelines = buildConfigs;
          this.applyFilters();
          this.applySort();
        })
    );

    this.subscriptions.push(
      this.pipelinesService.getOpenshiftConsoleUrl().subscribe((url: string) => {
        if (url) {
          this.consoleAvailable = true;
        } else {
          this.consoleAvailable = false;
        }
        this.openshiftConsoleUrl = url;
      })
    );
  }

  ngAfterViewInit() {
    this.checkUrl();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  get pipelines(): BuildConfig[] {
    return this._filteredPipelines;
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app opened',
      data: {
        source: 'pipelines'
      }
    });
  }

  filterChange($event: FilterEvent): void {
    this._appliedFilters = $event.appliedFilters;
    this.applyFilters();
    this.applySort();
    let urlFilter: object = {};
      this._appliedFilters.forEach((f) => {
        if (f.field.id === 'codebase') {
          if (urlFilter['codebase'] === undefined) {
            urlFilter['codebase'] = [];
          }
          urlFilter['codebase'].indexOf(f.value) === -1 ?
          urlFilter['codebase'].push(f.value) : urlFilter['codebase'];
        } else if (f.field.id === 'application') {
          if (urlFilter['application'] === undefined) {
            urlFilter['application'] = [];
          }
          urlFilter['application'].indexOf(f.value) === -1 ?
          urlFilter['application'].push(f.value) : urlFilter['application'];
        }
      });
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this._appliedFilters.length ? {q: JSON.stringify(urlFilter)} : {}
      });
  }

  sortChange($event: SortEvent): void {
    this._currentSortField = $event.field;
    this._ascending = $event.isAscending;
    this.applySort();
  }

  private applyFilters(): void {
    if (this._allPipelines) {
      const filteredPipelines = [];
      this._allPipelines.forEach((bc: BuildConfig) => {
        let matches = true;
        let spaceId = '';
        if (this._context) {
          spaceId = this._context.name;
          const paths = this._context.path.split('/');
          if (paths[paths.length - 1]) {
            spaceId = paths[paths.length - 1];
          }
        }
        if (spaceId) {
          const bcSpace = bc.labels['space'];
          if (bcSpace && bcSpace !== spaceId) {
            matches = false;
          }
        }
        this._appliedFilters.forEach(filter => {
          if (filter.field.id === 'application') {
            if (!bc.id.includes(filter.value)) {
              matches = false;
            }
          } else if (filter.field.id === 'codebase') {
            if (!bc.gitUrl.includes(filter.value)) {
              matches = false;
            }
          }
        });
        if (matches) {
          filteredPipelines.push(bc);
        }
      });
      this._filteredPipelines = filteredPipelines;
      this.toolbarConfig.filterConfig.resultsCount = this.pipelines.length;
    }
  }

  private applySort(): void {
    this._filteredPipelines.sort((a: BuildConfig, b: BuildConfig): number => {
      let res = 0;

      if (this._currentSortField.id === 'application' && a.id && b.id) {
        res = a.id.localeCompare(b.id);
      } else if (this._currentSortField.id === 'codebase' && a.gitUrl && b.gitUrl) {
        res = a.gitUrl.localeCompare(b.gitUrl);
      }

      if (!this._ascending) {
        res = res * -1;
      }
      return res;
    });
  }

  checkUrl(): void {
    this.subscriptions.push(
      this.route.queryParams.subscribe(query => {
        if (query.hasOwnProperty('q')) {
          let queryJson = JSON.parse(query.q);
          let application = queryJson.application;
          let codebase = queryJson.codebase;
          let appliedFilter = [];
          if (application !== undefined) {
            application.map(app => {
              appliedFilter.push({
                field: {
                  id: 'application',
                  title: 'Application',
                  type: 'text'
                },
                value: app
              });
            });
          }
          if (codebase !== undefined) {
            codebase.map(code => {
              appliedFilter.push({
                field: {
                  id: 'codebase',
                  title: 'Codebase',
                  type: 'text'
                },
                value: code
              });
            });
          }
          this._appliedFilters = appliedFilter;
          setTimeout(() => {
            this.toolbarConfig.filterConfig.appliedFilters = appliedFilter;
          }, 0);
          this.applyFilters();
          this.applySort();
        }
      })
    );
  }

}
