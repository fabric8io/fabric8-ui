import { ContextService } from './../shared/context.service';
import { MenuedContextType } from './menued-context-type';
import { Navigation } from './../models/navigation';
import { MenuItem } from './../models/menu-item';
import { ProfileService } from './../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthenticationService, Broadcaster, Logger, UserService, User } from 'ngx-login-client';
import { ContextType, Context, Contexts } from 'ngx-fabric8-wit';

import { DummyService } from './../shared/dummy.service';


interface MenuHiddenCallback {
  (headerComponent: HeaderComponent, context: Context): boolean;
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
      'settings', function (headerComponent, context) {
        return headerComponent.currentUser !== context.user;
      }
    ]
  ]);

  context: Context;
  recent: Context[];

  constructor(
    public router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    public dummy: DummyService,
    contexts: Contexts,
    public profile: ProfileService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getLoggedUser();
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
        this.updateMenus();
      }
    });
    contexts.current.subscribe(val => {
      this.context = val;
      this.updateMenus();
    });
    contexts.recent.subscribe(val => this.recent = val);
  }

  ngOnInit(): void {
    this.listenToEvents();

    this.userService.getUser().subscribe((userData) => {
      this.dummy.addUser(userData);
    }, (error) => {
      this.logger.log('Error retrieving user data: ' + error);
    });
  }

  get loggedInUser(): User {
    return this.dummy.currentUser;
  }

  get loggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/public']);
  }

  login() {
    this.router.navigate(['login']);
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  resetData(): void {
    this.imgLoaded = false;
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.resetData();
      });

    this.broadcaster.on<any>('authenticationError')
      .subscribe(() => {
        this.logout();
      });
  }

  private get currentUser(): User {
    return this.dummy.currentUser;
  }

  private getLoggedUser(): void {
    if (this.auth.isLoggedIn) {
      this.userService.getUser();
    }
  }

  private updateMenus() {
    if (this.context && this.context.type && this.context.type.hasOwnProperty('menus')) {
      for (let n of (this.context.type as MenuedContextType).menus) {
        // Clear the menu's active state
        n.active = false;
        if (this.menuCallbacks.has(n.path) && this.menuCallbacks.get(n.path)(this, this.context)) {
          n.hide = true;
        }
        if (n.menus) {
          let foundPath = false;
          for (let o of n.menus) {
            // Clear the menu's active state
            o.active = false;
            if (o.fullPath === this.router.url) {
              foundPath = true;
              o.active = true;
              n.active = true;
            }
            if (this.menuCallbacks.has(o.path) && this.menuCallbacks.get(o.path)(this, this.context)) {
              o.hide = true;
            }
          }
          if(!foundPath) {
            // routes that can't be correctly matched based on the url should use the parent path
            for (let o of n.menus) {
              o.active = false;
              let parentPath = '/' + this.router.routerState.snapshot.root.firstChild.url.join('/');
              if (o.fullPath === parentPath) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path) && this.menuCallbacks.get(o.path)(this, this.context)) {
                o.hide = true;
              }
            }
          }
        } else if (n.fullPath === this.router.url) {
          n.active = true;
        }
      }
    }
  }

}
