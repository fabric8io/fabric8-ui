import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';
import {
  Filter,
  FilterConfig,
  FilterEvent,
  FilterQuery,
  FilterType,
  SortEvent,
  SortField,
  ToolbarConfig
} from 'patternfly-ng';
import { Subscription } from 'rxjs';

import { BuildConfig } from 'a-runtime-console/index';
import {
  BsModalRef,
  BsModalService
} from 'ngx-bootstrap/modal';
import {
  Context,
  Contexts,
  Space
} from 'ngx-fabric8-wit';
import { pathJoin } from '../../../../a-runtime-console/kubernetes/model/utils';
import { Fabric8UIConfig } from '../../../shared/config/fabric8-ui-config';
import { PipelinesService } from '../../../shared/runtime-console/pipelines.service';
import { SwitchableNamespaceScope } from './switchable-namepsace.scope';

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
  private modalRef: BsModalRef;

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
            type: FilterType.SELECT,
            queries: this._apps
          },
          {
            id: 'codebase',
            title: 'Codebase',
            placeholder: 'Filter by Codebase...',
            type: FilterType.SELECT,
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

  ngOnInit(): void {
    this._pipelinesSubscription = this.pipelinesService.current
      .subscribe((buildConfigs: BuildConfig[]) => {
        buildConfigs.forEach((buildConfig: BuildConfig) => {
          const application: string = buildConfig.id;
          const codebase: string = buildConfig.gitUrl;
          if (!this._apps.find(fq => fq.id === application)) {
            this._apps.push({ id: application, value: application } as FilterQuery);
          }
          if (!this._codebases.find(fq => fq.id === codebase)) {
            this._codebases.push({ id: codebase, value: codebase } as FilterQuery);
          }
        });
        this._allPipelines = buildConfigs;
        this.applyFilters();
        this.applySort();
        this.updateConsoleLink();
      });

    this.contextSubscription = this.contexts.current
      .subscribe((context: Context) => {
        this._context = context;
        this.space = context.space;
      });
  }

  ngOnDestroy(): void {
    this._pipelinesSubscription.unsubscribe();
    this.contextSubscription.unsubscribe();
  }

  get pipelines(): BuildConfig[] {
    return this._filteredPipelines;
  }

  openForgeWizard(addSpace: TemplateRef<any>): void {
    if (this.authService.getGitHubToken()) {
      this.selectedFlow = '';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal(): void {
    this.modalRef.hide();
  }

  selectFlow($event: any): void {
    this.selectedFlow = $event.flow;
  }

  filterChange($event: FilterEvent): void {
    this._appliedFilters = $event.appliedFilters;
    this.applyFilters();
  }

  sortChange($event: SortEvent): void {
    this._currentSortField = $event.field;
    this._ascending = $event.isAscending;
    this.applySort();
  }

  private updateConsoleLink(): void {
    this.openshiftConsoleUrl = this.fabric8UIConfig.openshiftConsoleUrl;
    const pipelines = this._allPipelines;
    if (this.openshiftConsoleUrl && pipelines && pipelines.length) {
      const pipeline = pipelines[0];
      const namespace = pipeline.namespace;
      if (namespace) {
        this.openshiftConsoleUrl = pathJoin(this.openshiftConsoleUrl, '/project', namespace, '/browse/pipelines');
      }
    }
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
            if (filter.value !== bc.id) {
              matches = false;
            }
          } else if (filter.field.id === 'codebase') {
            if (filter.value !== bc.gitUrl) {
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
    this._filteredPipelines.sort(this.compare.bind(this));
  }

  private compare(a: BuildConfig, b: BuildConfig): number {
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
  }

}
