import { MenuedContextType } from './menued-context-type';
import { Injectable } from '@angular/core';
import { MenuItem } from './../models/menu-item';
import { ContextType, Contexts, ContextTypes, Context } from 'ngx-fabric8-wit';
import { cloneDeep } from 'lodash';

@Injectable()
export class MenusService {

  readonly menus: Map<ContextType, MenuItem[]>;

  constructor() {
    this.menus = new Map<ContextType, MenuItem[]>([
      [
        ContextTypes.BUILTIN.get('user'),
        [
          {
            name: 'Home',
            path: '/_home'
          }, {
            name: 'Profile',
            path: '',
            menus: [
              {
                name: 'Profile',
                path: ''
              }, {
                name: 'Spaces',
                path: '_spaces'
              }, {
                name: 'Resources',
                path: '_resources'
              }
            ]
          },
          {
            path: '_settings',
            icon: 'pficon pficon-settings',
            menus: [
              {
                name: 'Profile',
                path: ''
              },
              {
                name: 'Access Tokens',
                path: 'tokens'
              }
            ]
          }
        ]
      ],
      [
        ContextTypes.BUILTIN.get('space'),
        [
          {
            name: 'Analyze',
            path: '',
            menus: [
              {
                name: 'Overview',
                path: ''
              }, {
                name: 'README',
                path: 'readme'
              }, {
                name: 'Stack',
                path: 'stack'
              }
            ]
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
                name: 'Environments',
                path: 'environments'
              }
            ]
          }, {
            name: '',
            path: 'settings',
            icon: 'pficon pficon-settings',
            menus: [
              {
                name: 'Overview',
                path: '',
                icon: '',
                menus: []
              }, {
                name: 'Work',
                path: 'work'
              }, {
                name: 'Security',
                path: 'security'
              }, {
                name: 'Alerts',
                path: 'alerts'
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
