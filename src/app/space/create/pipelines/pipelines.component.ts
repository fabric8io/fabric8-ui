import { Fabric8UIConfig } from './../../../shared/config/fabric8-ui-config';
import {
  Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ViewEncapsulation,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { AuthenticationService, UserService } from 'ngx-login-client';
import { Broadcaster } from 'ngx-base';
import { ToolbarConfig, FilterConfig, FilterQuery, FilterEvent, Filter, SortEvent, SortField } from 'patternfly-ng';


import { SwitchableNamespaceScope } from './switchable-namepsace.scope';
import { PipelinesService } from './../../../shared/runtime-console/pipelines.service';
import { Fabric8RuntimeConsoleService } from './../../../shared/runtime-console/fabric8-runtime-console.service';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore
} from '../../../../a-runtime-console/index';

import { pathJoin } from '../../../../a-runtime-console/kubernetes/model/utils';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-pipelines',
  templateUrl: 'pipelines.component.html',
  styleUrls: ['./pipelines.component.less']
})
export class PipelinesComponent implements OnInit, OnDestroy {

  toolbarConfig: ToolbarConfig;
  openshiftConsoleUrl: string;

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

  private selectedFlow: string;
  private space: Space;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private contexts: Contexts,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private pipelinesService: PipelinesService,
    private fabric8UIConfig: Fabric8UIConfig,
    private broadcaster: Broadcaster
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
        let spaceId = '';
        if (this._context) {
          spaceId = this._context.name;
          let paths = this._context.path.split('/');
          if (paths[paths.length - 1]) {
            spaceId = paths[paths.length - 1];
          }
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
        // console.log('Updating build configs:', val);
        this._allPipelines = val;
        this.applyFilters();
        this.applySort();
        this.updateConsoleLink();
      });

    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
      this.space = val.space;
    });
  }

  updateConsoleLink() {
    this.openshiftConsoleUrl = this.fabric8UIConfig.openshiftConsoleUrl;
    let pipelines = this._allPipelines;
    if (this.openshiftConsoleUrl && pipelines && pipelines.length) {
      let pipeline = pipelines[0];
      let namespace = pipeline.namespace;
      if (namespace) {
        this.openshiftConsoleUrl = pathJoin(this.openshiftConsoleUrl, '/project', namespace, '/browse/pipelines');
      }
    }
  }

  ngOnDestroy() {
    this._pipelinesSubscription.unsubscribe();
    this.contextSubscription.unsubscribe();
  }

  get pipelines() {
    return this._filteredPipelines;
  }

  openForgeWizard(addSpace: TemplateRef<any>) {
    if (this.authService.getGitHubToken()) {
      this.selectedFlow = '';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
  }
}
