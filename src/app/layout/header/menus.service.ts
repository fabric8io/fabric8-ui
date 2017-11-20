import { MenuedContextType } from './menued-context-type';
import { Injectable } from '@angular/core';
import { MenuItem } from './../../models/menu-item';
import { ContextType, Contexts, ContextTypes, Context } from 'ngx-fabric8-wit';
import { cloneDeep } from 'lodash';

@Injectable()
export class MenusService {

  readonly menus: Map<ContextType, MenuItem[]>;

  constructor() {
    this.menus = new Map<ContextType, MenuItem[]>([
      [
        ContextTypes.BUILTIN.get('space'),
        [
          {
            name: '',
            path: 'settings',
            icon: 'pficon pficon-settings',
            menus: [
              {
                name: 'Areas',
                path: '',
                icon: '',
                menus: []
              },
              {
                name: 'Collaborators',
                path: 'collaborators'
              }
            ]
          }, {
            name: 'Analyze',
            path: ''
          }, {
            name: 'Plan',
            path: 'plan',
            menus: [
              {
                name: 'Backlog',
                path: ''
              }, {
                name: 'Board',
                path: 'board'
              }
            ]
          }, {
            name: 'Create',
            path: 'create',
            menus: [
              {
                name: 'Codebases',
                path: ''
              },
              {
                name: 'Pipelines',
                path: 'pipelines'
              },
              {
                name: 'Applications',
                path: 'apps'
              },
              {
                name: 'Deployments',
                path: 'deployments'
              },
              {
                name: 'Environments',
                path: 'environments'
              }
            ]
          }
        ]
      ]
    ]);

  }

  public attach(context: Context) {
    if ( !(context.type instanceof MenuedContextType || (<MenuedContextType> context.type).menus ) ) {
      // Take a copy of the context to attach menus to (not sure we need to do this)
      let res = cloneDeep(context.type) as MenuedContextType;
      // Take a copy of the menus and attach them
      res.menus = cloneDeep(this.menus.get(context.type));
      if (!res.menus) {
        console.log('Failed to attach menus to', context.type);
        return;
      }
      for (let n of res.menus) {
        n.fullPath = this.buildPath(context.path, n.path);
        if (n.menus) {
          for (let o of n.menus) {
            o.fullPath = this.buildPath(context.path, n.path, o.path);
          }
        }
      }
      context.type = res;
    }
  }

  private buildPath(...args: string[]): string {
    let res = '';
    for (let p of args) {
      if (p.startsWith('/')) {
        res = p;
      } else {
        res = res + '/' + p;
      }
      res = res.replace(/\/*$/, '');
    }
    return res;
  }
}
