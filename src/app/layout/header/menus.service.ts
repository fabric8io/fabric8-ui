import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';
import { Context, ContextType, ContextTypes } from 'ngx-fabric8-wit';

import { Feature } from '../../feature-flag/service/feature-toggles.service';
import { MenuItem } from '../../models/menu-item';
import { MenuedContextType } from './menued-context-type';

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
            feature: 'Planner',
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
                feature: 'Applications',
                path: 'apps'
              },
              {
                name: 'Environments',
                feature: 'Environments',
                path: 'environments'
              },
              {
                name: 'Deployments',
                feature: 'Deployments',
                path: 'deployments'
              }
            ]
          }
        ]
      ]
    ]);
  }
  private isFeatureEnabled(feature: string, features: Feature[]): boolean {
    for (let f of features) {
      if (f.id === feature) {
        return f.attributes.enabled;
      }
    }
    return true;
  }

  public attach(context: Context) {
    if (!(context.type instanceof MenuedContextType || (<MenuedContextType> context.type).menus)) {
      // Take a copy of the context to attach menus to (not sure we need to do this)
      let res = cloneDeep(context.type) as MenuedContextType;
      // Take a copy of the menus and attach them
      res.menus = cloneDeep(this.menus.get(context.type));
      if (!res.menus) {
        console.log('Failed to attach menus to', context.type);
        return;
      }
      let menuToDelete = [];
      for (let menu of res.menus) {
        if (menu['feature'] && context.user['features'] && !this.isFeatureEnabled(menu['feature'], context.user['features'])) {
          menuToDelete.push(menu);
        } else {
          menu.fullPath = this.buildPath(context.path, menu.path);
          if (menu.menus) {
            let subMenuToDelete = [];
            for (let subMenu of menu.menus) {
              if (subMenu['feature'] && context.user['features'] && !this.isFeatureEnabled(subMenu['feature'], context.user['features'])) {
                subMenuToDelete.push(subMenu);
              } else {
                subMenu.fullPath = this.buildPath(context.path, menu.path, subMenu.path);
              }
            }
            if (subMenuToDelete.length > 0) { // some subMenu need to be removed
              menu.menus = menu.menus.filter(obj => subMenuToDelete.filter(m => m.name === obj.name).length == 0);
            }
          }
        }
      }
      if (menuToDelete.length > 0) { // some menu need to be remove
        res.menus = res.menus.filter(obj => menuToDelete.filter(m => m.name === obj.name).length == 0);
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
