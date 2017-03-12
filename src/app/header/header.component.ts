import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { AuthenticationService, Broadcaster, Logger, UserService, User } from 'ngx-login-client';
import { ContextType, Context, Contexts } from 'ngx-fabric8-wit';


import { ContextService } from './../shared/context.service';
import { MenuedContextType } from './menued-context-type';
import { Navigation } from './../models/navigation';
import { MenuItem } from './../models/menu-item';
import { ProfileService } from './../profile/profile.service';
import { DummyService } from './../shared/dummy.service';



interface MenuHiddenCallback {
  (headerComponent: HeaderComponent): Observable<boolean>;
}

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: []
})
export class HeaderComponent implements OnInit {
  title = 'Almighty';
  imgLoaded: Boolean = false;

  menuCallbacks = new Map<String, MenuHiddenCallback>([
    [
      '_settings', function (headerComponent) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ],
    [
      '_resources', function (headerComponent) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ]
  ]);

  context: Context;
  recent: Context[];
  loggedInUser: User;
  private _loggedInUserSubscription: Subscription;

  constructor(
    public router: Router,
    private userService: UserService,
    private logger: Logger,
    public auth: AuthenticationService,
    private broadcaster: Broadcaster,
    public dummy: DummyService,
    private contexts: Contexts,
    public profile: ProfileService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
        this.updateMenus();
      }
    });
    contexts.current.subscribe(val => {
      this.context = val;
      this.updateMenus();
    });
    contexts.recent.subscribe(val => this.recent = val);

    // Currently logged in user
    this.userService.loggedInUser.subscribe(
      val => {
        if (val.id) {
          this.loggedInUser = val;
        } else {
          this.resetData();
          this.loggedInUser = null;
          this.router.navigate(['/', 'public']);
        }
      }
    );
  }

  ngOnInit(): void {

  }

  login() {
    this.router.navigate(['/', 'public']);
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  resetData(): void {
    this.imgLoaded = false;
  }

  private updateMenus() {
    if (this.context && this.context.type && this.context.type.hasOwnProperty('menus')) {
      for (let n of (this.context.type as MenuedContextType).menus) {
        // Clear the menu's active state
        n.active = false;
        if (this.menuCallbacks.has(n.path)) {
          this.menuCallbacks.get(n.path)(this).subscribe(val => n.hide = val);
        }
        if (n.menus) {
          let foundPath = false;
          for (let o of n.menus) {
            // Clear the menu's active state
            o.active = false;
            if (o.fullPath === decodeURIComponent(this.router.url)) {
              foundPath = true;
              o.active = true;
              n.active = true;
            }
            if (this.menuCallbacks.has(o.path)) {
              this.menuCallbacks.get(o.path)(this).subscribe(val => o.hide = val);
            }
          }
          if (!foundPath) {
            // routes that can't be correctly matched based on the url should use the parent path
            for (let o of n.menus) {
              o.active = false;
              let parentPath = decodeURIComponent('/' + this.router.routerState.snapshot.root.firstChild.url.join('/'));
              if (o.fullPath === parentPath) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path)) {
                this.menuCallbacks.get(o.path)(this).subscribe(val => o.hide = val);
              }
            }
          }
        } else if (n.fullPath === this.router.url) {
          n.active = true;
        }
      }
    }
  }

  private checkContextUserEqualsLoggedInUser(): Observable<boolean> {
    return Observable.combineLatest(
      this.contexts.current.map(val => val.user.id),
      this.userService.loggedInUser.map(val => val.id),
      (a, b) => (a !== b)
    );
  }

}
