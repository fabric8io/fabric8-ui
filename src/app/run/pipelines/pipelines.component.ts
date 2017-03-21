import { BuildConfigService } from 'fabric8-runtime-console/src/app/kubernetes/service/buildconfig.service';
import { SwitchableNamespaceScope } from './switchable-namepsace.scope';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from 'ngx-login-client';

import { ToolbarConfig, FilterConfig, FilterQuery, FilterEvent, Filter, SortEvent, SortField } from 'ngx-widgets';

// TODO HACK
import { OnLogin } from 'fabric8-runtime-console/src/app/shared/onlogin.service';
import { OAuthConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/oauth-config-store';
import {
  BuildConfig, BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines
} from 'fabric8-runtime-console/src/app/kubernetes/model/buildconfig.model';
import { APIsStore } from 'fabric8-runtime-console/src/app/kubernetes/store/apis.store';
import { BuildConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/buildconfig.store';
import { BuildStore } from 'fabric8-runtime-console/src/app/kubernetes/store/build.store';

class Environment {
  name: string;
  type: EnvironmentType;
  namespaceRef: string;
}

class EnvironmentType {

  public static readonly DEV = { name: 'dev' } as EnvironmentType;
  public static readonly INT = { name: 'int' } as EnvironmentType;
  public static readonly PROD = { name: 'prod' } as EnvironmentType;

  name: string;
}

@Component({
  selector: 'alm-pipelines',
  templateUrl: 'pipelines.component.html',
  styleUrls: ['./pipelines.component.scss']
})
export class PipelinesComponent implements OnInit {

  toolbarConfig: ToolbarConfig;

  private _apps: FilterQuery[] = [];
  private _codebases: FilterQuery[] = [];
  private _filteredPipelines: BuildConfig[] = [];
  private _allPipelines: BuildConfig = [];
  private _environments: Map<Space, Environment[]>;
  private _appliedFilters: Filter[] = [];
  private _ascending: boolean;
  private _currentSortField: SortField = {
            id: 'application',
            title: 'Application',
            sortType: 'alpha'
          } as SortField;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private onLogin: OnLogin,
    private oauthConfigStore: OAuthConfigStore,
    private userService: UserService,

    // TODO HACK - Dummy Data loading

    // TODO HACK - Fabric8 Runtime Console modularity
    private pipelinesStore: BuildConfigStore,
    private buildStore: BuildStore,
    private apiStore: APIsStore
  ) {

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

    if (this._currentSortField.id === 'application' && a.labels.app && b.labels.app) {
      res = a.labels.app.localeCompare(b.labels.app);
    } else if (this._currentSortField.id === 'codebase' && a.labels.codebase && b.labels.codebase) {
      res = a.labels.codebase.localeCompare(b.labels.codebase);
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
        this._appliedFilters.forEach(filter => {
          if (filter.field.id === 'application') {
            if (filter.value !== bc.labels.app) {
              matches = false;
            }
          } else if (filter.field.id === 'codebase') {
            if (filter.value !== bc.labels.codebase) {
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
    this.apiStore.load();
    this.apiStore.loading.distinctUntilChanged().filter(flag => (!flag))
      .switchMap(() => this.authService.getOpenShiftToken())
      .switchMap(token =>
        this.oauthConfigStore.resource.do(config => {
          if (config.loaded) {
            this.onLogin.onLogin(token);
          }
        })
      ).switchMap(val => this.userService.loggedInUser)
      .map(user => `${user.attributes.username}-osio`)
      .switchMap(namespace => this.pipelinesStore.loadAll())
      .combineLatest(this.buildStore.loadAll(), combineBuildConfigAndBuilds)
      .map(filterPipelines)
      .do(val => {
        (val as BuildConfig[])
          .forEach(buildConfig => {
            if (!this._apps.find(fq => fq.id === buildConfig.labels.app)) {
              this._apps.push({ id: buildConfig.labels.app, value: buildConfig.labels.app } as FilterQuery);
            }
            if (!this._codebases.find(fq => fq.id === buildConfig.labels.codebase)) {
              this._codebases.push({ id: buildConfig.labels.codebase, value: buildConfig.labels.codebase } as FilterQuery);
            }
          });
      })
      .subscribe(val => {
        console.log('Updating build configs:', val);
        this._allPipelines = val;
        this.applyFilters();
        this.applySort();
      });
  }

  get pipelines() {
    return this._filteredPipelines;
  }

  /*private buildDummyData(balloonPopGame: Space) {
    this._environments = new Map([
      [
        balloonPopGame,
        [
          {
            name: 'development',
            type: EnvironmentType.DEV,
            namespaceRef: 'rhn-support-pmuir-dev'
          } as Environment,
          {
            name: 'integration',
            type: EnvironmentType.INT,
            namespaceRef: 'rhn-support-pmuir-int'
          } as Environment
        ]
      ]
    ]);
  }*/

}
