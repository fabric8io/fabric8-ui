import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ParentLinkFactory } from '../../../common/parent-link-factory';
import { MenuItem } from '../../../models/menu-item';

export const resourceMenus = [
  {
    name: 'ConfigMap',
    path: 'configmaps'
  },
  {
    name: 'Deployments',
    path: 'deployments'
  },
  {
    name: 'Events',
    path: 'events'
  },
  {
    name: 'Pods',
    path: 'pods'
  },
  {
    name: 'ReplicaSets',
    path: 'replicasets'
  },
  {
    name: 'Services',
    path: 'services'
  }
];

@Component({
  host: {
    'class': 'kube-resource-header'
  },
  selector: 'kube-resource-header',
  templateUrl: './resource.header.component.html',
  styleUrls: ['./resource.header.component.less']
})
export class ResourceHeaderComponent implements OnInit {
  menus: MenuItem[];
  current: MenuItem;


  constructor(public router: Router, parentLinkFactory: ParentLinkFactory) {
    this.menus = resourceMenus;

    var urlPrefix = parentLinkFactory.parentLink;
    this.menus.forEach(menu => {
      if (!menu.fullPath) {
        var path = menu.path;
        menu.fullPath = urlPrefix + path;
      }
    });
    this.current = this.menus[0];

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.onNavigate(event);
      }
    });
  }

  ngOnInit(): void {
    /*
     this.listenToEvents();
     this.onNavigate();
     this.dummy.ngOnInit();
     */
  }

  onNavigate(event: NavigationEnd): void {
    var url = event.url;
    var menus = this.menus;
    if (url && menus) {
      var paths = url.split('/');
      if (paths && paths.length) {
        var path = paths[paths.length - 1];
        this.current = null;
        menus.forEach(menu => {
          if (path === menu.path) {
            this.current = menu;
          }
        });
        if (!this.current) {
          console.log('Could not find menu for resource kind: ' + path);
        }
      }
    }
  }
}
