import { ObservableFabric8UIConfig } from './../../shared/config/fabric8-ui-config.service';
import {Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { AuthenticationService, UserService } from 'ngx-login-client';
import { ToolbarConfig, FilterConfig, FilterQuery, FilterEvent, Filter, SortEvent, SortField } from 'ngx-widgets';


import { SwitchableNamespaceScope } from './switchable-namepsace.scope';
import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Fabric8RuntimeConsoleService } from './../../shared/runtime-console/fabric8-runtime-console.service';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore
} from 'fabric8-runtime-console';

import { pathJoin } from "fabric8-runtime-console/src/app/kubernetes/model/utils";
import {IModalHost} from "../../space-wizard/models/modal-host";
import {SpaceWizardComponent} from "../../space-wizard/space-wizard.component";
import { Context, Contexts } from 'ngx-fabric8-wit';

@Component({
  selector: 'alm-pipelines',
  templateUrl: 'pipelines.component.html',
  styleUrls: ['./pipelines.component.scss']
})
export class PipelinesComponent implements OnInit, OnDestroy {

  toolbarConfig: ToolbarConfig;
  openshiftConsoleUrl: string;

  @ViewChild('updateSpace') updateSpace: IModalHost;
  @ViewChild('spaceWizard') spaceWizard: SpaceWizardComponent;

  private _context: Context;
  private contextSubscription: Subscription;

  private _apps: FilterQuery[] = [];
  private _codebases: FilterQuery[] = [];
  private _filteredPipelines: BuildConfig[] = [];
  private _allPipelines: BuildConfig[] = [];

  private _appliedFilters: Filter[] = [];
  private _ascending: boolean;
  private _currentSortField: SortField = {
    id: 'application',
    title: 'Application',
    sortType: 'alpha'
  } as SortField;
  private _pipelinesSubscription: Subscription;


  constructor(
    private contexts: Contexts,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private pipelinesService: PipelinesService,
    private fabric8UIConfig: ObservableFabric8UIConfig
  ) {

    this.updateConsoleLink();

    this.toolbarConfig = {
      filterConfig: {
        fields: [
          {
            id: 'application',
            title: 'Application',
            placeholder: 'Filter by Application...',
            type: 'select',
            queries: this._apps
          },
          {
            id: 'codebase',
            title: 'Codebase',
            placeholder: 'Filter by Codebase...',
            type: 'select',
            queries: this._codebases
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

  filterChange($event: FilterEvent) {
    this._appliedFilters = $event.appliedFilters;
    this.applyFilters();
  }

  sortChange($event: SortEvent) {
    this._currentSortField = $event.field;
    this._ascending = $event.isAscending;
    this.applySort();
  }

  applySort() {
    this._filteredPipelines.sort((a: any, b: any) => this.compare(a, b));
  }

  compare(a: BuildConfig, b: BuildConfig) {
    let res = 0;

    if (this._currentSortField.id === 'application' && a.labels['app'] && b.labels['app']) {
      res = a.labels['app'].localeCompare(b.labels['app']);
    } else if (this._currentSortField.id === 'codebase' && a.labels['codebase'] && b.labels['codebase']) {
      res = a.labels['codebase'].localeCompare(b.labels['codebase']);
    }

    if (!this._ascending) {
      res = res * -1;
    }
    return res;
  }


  applyFilters() {
    if (this._allPipelines) {
      let filteredPipelines = [];
      this._allPipelines.forEach(bc => {
        let matches = true;
        let spaceId = "";
        if (this._context) {
          spaceId = this._context.name;
        }
        if (spaceId) {
          let bcSpace = bc.labels['space'];
          if (bcSpace && bcSpace !== spaceId) {
            matches = false;
          }
        }
        this._appliedFilters.forEach(filter => {
          if (filter.field.id === 'application') {
            if (filter.value !== bc.labels['app']) {
              matches = false;
            }
          } else if (filter.field.id === 'codebase') {
            if (filter.value !== bc.labels['codebase']) {
              matches = false;
            }
          }
        });
        if (matches) {
          filteredPipelines.push(bc);
        }
      });
      this._filteredPipelines = filteredPipelines;
    }
  }


  ngOnInit() {
    this._pipelinesSubscription = this.pipelinesService.current
      .do(val => {
        (val as BuildConfig[])
          .forEach(buildConfig => {
            if (!this._apps.find(fq => fq.id === buildConfig.labels['app'])) {
              this._apps.push({ id: buildConfig.labels['app'], value: buildConfig.labels['app'] } as FilterQuery);
            }
            if (!this._codebases.find(fq => fq.id === buildConfig.labels['codebase'])) {
              this._codebases.push({ id: buildConfig.labels['codebase'], value: buildConfig.labels['codebase'] } as FilterQuery);
            }
          });
      })
      .subscribe(val => {
        //console.log('Updating build configs:', val);
        this._allPipelines = val;
        this.applyFilters();
        this.applySort();
        this.updateConsoleLink();
      });

    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
    });
  }

  updateConsoleLink() {
    this.fabric8UIConfig.subscribe(config => {
      this.openshiftConsoleUrl = config.openshiftConsoleUrl;
      let pipelines = this._allPipelines;
      if (this.openshiftConsoleUrl && pipelines && pipelines.length) {
        let pipeline = pipelines[0];
        let namespace = pipeline.namespace;
        if (namespace) {
          this.openshiftConsoleUrl = pathJoin(this.openshiftConsoleUrl, "/project", namespace, "/browse/pipelines");
        }
      }
    });
  }

  ngOnDestroy() {
    this._pipelinesSubscription.unsubscribe();
    this.contextSubscription.unsubscribe();
  }

  get pipelines() {
    return this._filteredPipelines;
  }

  openForgeWizard() {
    this.updateSpace.open(this.spaceWizard.steps.spaceConfigurator);
  }
}
