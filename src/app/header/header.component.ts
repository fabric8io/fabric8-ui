import { MenuItem } from './../models/menu-item';
import { ProfileService } from './../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthenticationService, Broadcaster, Logger, UserService, User } from 'ngx-login-client';

import { ContextType } from './../models/context-type';
import { Context } from './../models/context';
import { ContextService } from '../shared/context.service';
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
        return headerComponent.currentUser !== context.entity;
      }
    ]
  ]);

  constructor(
    public router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    public dummy: DummyService,
    public context: ContextService,
    public profile: ProfileService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.onNavigate(val.url);
      }
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

  ngOnInit(): void {
    this.listenToEvents();
  }

  onNavigate(url: string): void {
    this.getLoggedUser();
    this.broadcaster.broadcast('navigate', {url: url});
    if (this.context.current) {
      this.setActiveMenus(this.context.current);
      this.setHiddenMenus(this.context.current);
    }
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
  }

  private get currentUser(): User {
    return this.dummy.currentUser;
  }

  private getLoggedUser(): void {
    if (this.auth.isLoggedIn) {
      this.userService.getUser();
    }
  }

  private setHiddenMenus(context: Context) {
    if ((<ContextType>context.type).menus) {
      for (let n of (<ContextType>context.type).menus) {
        if (this.menuCallbacks.has(n.path) && this.menuCallbacks.get(n.path)(this, context)) {
          n.hide = true;
        }
        if (n.menus) {
          for (let o of n.menus) {
            if (this.menuCallbacks.has(o.path) && this.menuCallbacks.get(o.path)(this, context)) {
              o.hide = true;
            }
          }
        }
      }
    }
  }

  private setActiveMenus(context: Context) {
    if ((<ContextType>context.type).menus) {
      for (let n of (<ContextType>context.type).menus) {
        // Clear the menu's active state
        n.active = false;
        if (n.menus) {
          for (let o of n.menus) {
            // Clear the menu's active state
            o.active = false;
            if (o.fullPath === this.router.url) {
              o.active = true;
              n.active = true;
            }
          }
        } else if (n.fullPath === this.router.url) {
          n.active = true;
        }
      }
    }
  }

}
