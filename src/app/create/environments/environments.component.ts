import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthenticationService, UserService } from 'ngx-login-client';
import { Space, Contexts } from 'ngx-fabric8-wit';
import { createDeploymentViews, CompositeDeploymentStore, ServiceStore } from 'fabric8-runtime-console';

import { SwitchableNamespaceScope } from './../../shared/runtime-console/switchable-namepsace.scope';


import {
  ToolbarConfig,
  FilterConfig,
  FilterQuery,
  FilterEvent,
  Filter,
  SortEvent,
  SortField
} from 'ngx-widgets';

import {
  TreeNode,
  TREE_ACTIONS,
  IActionMapping
} from 'angular2-tree-component';



class Environment {
  name: string;
  type: EnvironmentType;
  namespaceRef: string;
  space: Space;
}

class EnvironmentType {


  public static readonly DEV = { name: 'dev' } as EnvironmentType;
  public static readonly INT = { name: 'int' } as EnvironmentType;
  public static readonly PROD = { name: 'prod' } as EnvironmentType;

  name: string;

  public static readonly MAPPED: Map<string, EnvironmentType> = new Map([
    [EnvironmentType.DEV.name, EnvironmentType.DEV],
    [EnvironmentType.INT.name, EnvironmentType.INT],
    [EnvironmentType.PROD.name, EnvironmentType.PROD],
  ]);

}

@Component({
  selector: 'alm-environments',
  templateUrl: 'environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  environments: Observable<Environment[]>;

  nodes: any[] = [
    {
      name: 'ConfigMap',
      hasChildren: true
    },
    {
      name: 'Deployments',
      hasChildren: true
    },
    {
      name: 'Events',
      hasChildren: true
    }, {
      name: 'Pods',
      hasChildren: true
    }, {
      name: 'Replica Sets',
      hasChildren: true
    }, {
      name: 'Services',
      hasChildren: true
    }
  ];
  // See: https://angular2-tree.readme.io/docs/options
  options = {
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      }
    },
    allowDrag: false,
    isExpandedField: 'expanded',
    getChildren: this.getChildren.bind(this)
  };

  toolbarConfig: ToolbarConfig;
  private _apps: FilterQuery[] = [];
  private _codebases: FilterQuery[] = [];
  private _appliedFilters: Filter[] = [];
  private _ascending: boolean;
  private _currentSortField: SortField = {
    id: 'application',
    title: 'Application',
    sortType: 'alpha'
  } as SortField;


  constructor(
    contexts: Contexts,
    private switchableNamespace: SwitchableNamespaceScope,
    private deploymentsStore: CompositeDeploymentStore,
    private serviceStore: ServiceStore
  ) {
    // TODO DUMMY Set up a couple of dummy environments for the current space
    // NOTE This requires you to manually set up the right projects in OpenShift
    //      <username>-dev and <username>-int
    this.environments = contexts.current
      .map(context => ['dev', 'int'].map(env => ({
        name: `${context.space.attributes.name} (${env.slice(0, 1).toLocaleUpperCase()}${env.slice(1, env.length)})`,
        type: EnvironmentType.MAPPED.get(env),
        namespaceRef: `${context.user.attributes.username}-${env}`,
        space: context.space
      } as Environment)));

    // Configure the toolbar
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
        resultsCount: 0,
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

  ngOnInit() {
  }

  // CODE RELATED TO KUBERNETES

  private get deployments(): Observable<any> {
    let res = this.environments
      .map(environments => environments[0])
      .switchMap(environment => {
        this.switchableNamespace.changeNamespace(environment.namespaceRef);
        return Observable.combineLatest(
          this.deploymentsStore.loadAll().distinctUntilChanged(),
          this.serviceStore.loadAll().distinctUntilChanged(),
          createDeploymentViews);
      })
      // TODO HACK Deal with the over excited stream
      .debounceTime(300)
      .do(val => console.log('debounced', val));
    return res;
  }

  // CODE RELATED TO WIDGETS

  filterChange($event: FilterEvent) {
    this._appliedFilters = $event.appliedFilters;
    //this.applyFilters();
  }

  sortChange($event: SortEvent) {
    this._currentSortField = $event.field;
    this._ascending = $event.isAscending;
    //this.applySort();
  }

  applySort() {
    //this._filteredPipelines.sort((a: any, b: any) => this.compare(a, b));
  }

  getChildren(node: TreeNode) {
    if (node.data.name === 'Deployments') {
      return this.deployments
        .map(deployments => deployments.map(deployment => ({
          name: deployment.name,
          deployment: deployment,
          hasChildren: false
        })))
        .do(val => console.log('children:', val)).first()
        .toPromise();
    } else {
      return Observable.of({}).toPromise();
    }
  }

  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  /*compare(a: any, b: any) {
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
  }*/


  /*applyFilters() {
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
  }*/

}
