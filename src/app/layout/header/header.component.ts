import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Params, Router } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { PermissionService, User, UserService } from 'ngx-login-client';
import { combineLatest as observableCombineLatest, Observable,  of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem } from '../../models/menu-item';
import { Navigation } from '../../models/navigation';
import { LoginService } from '../../shared/login.service';
import { MenuedContextType } from './menued-context-type';
import { MenusService } from './menus.service';

interface MenuHiddenCallback {
  (headerComponent: HeaderComponent, menuItem: MenuItem): Observable<boolean>;
}

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  imgLoaded: boolean = false;
  isIn: boolean = false;   // store state

  toggleState() { // click handler
      let bool: boolean = this.isIn;
      this.isIn = bool === false ? true : false;
  }

  menuCallbacks: Map<String, MenuHiddenCallback> = new Map<String, MenuHiddenCallback>([
    [
      '_settings', function(headerComponent, menuItem) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ],
    [
      '_resources', function(headerComponent, menuItem) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ],
    [
      'settings', function(headerComponent, menuItem) {
        const subFeature = menuItem['subFeature'];
        const allFeatures = headerComponent.context.user['features'];
        if (subFeature && allFeatures && headerComponent.menusService.isFeatureUserEnabled(subFeature, allFeatures)) {
          return headerComponent.loggedInUserNotSpaceAdmin();
        }
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ]
  ]);

  recent: Context[];
  appLauncherEnabled: boolean = false;
  loggedInUser: User;
  private _context: Context;
  private _defaultContext: Context;
  private plannerFollowQueryParams: Object = {};
  private eventListeners: any[] = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    public loginService: LoginService,
    private broadcaster: Broadcaster,
    private contexts: Contexts,
    private permissionService: PermissionService,
    private menusService: MenusService
  ) {
    router.events.subscribe((val: Event): void => {
      if (val instanceof NavigationEnd) {
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
        this.updateMenus();
      }
    });
    this.contexts.current.subscribe((val: Context): void => {
      this._context = val;
      this.updateMenus();
    });
    this.contexts.default.subscribe((val: Context): void => {
      this._defaultContext = val;
    });
    this.contexts.recent.subscribe((val: Context[]): void => {
      this.recent = val;
    });

    // Currently logged in user
    this.userService.loggedInUser.subscribe(
      (val: User): void => {
        if (val.id) {
          this.loggedInUser = val;
        } else {
          this.resetData();
          this.loggedInUser = null;
        }
      }
    );
  }

  ngOnInit(): void {
    this.listenToEvents();
  }

  ngOnDestroy(): void {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  listenToEvents(): void {
    this.eventListeners.push(
      this.route.queryParams.subscribe((params: Params): void => {
        this.plannerFollowQueryParams = {};
        if (Object.keys(params).indexOf('iteration') > -1) {
          this.plannerFollowQueryParams['iteration'] = params['iteration'];
        }
      })
    );
  }

  login(): void {
    this.loginService.redirectUrl = this.router.url;
    this.broadcaster.broadcast('login');
    this.loginService.redirectToAuth();
  }

  logout(): void {
    this.loginService.logout();

  }

  onImgLoad(): void {
    this.imgLoaded = true;
  }

  resetData(): void {
    this.imgLoaded = false;
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

  get context(): Context {
    if (this.router.url.startsWith('/_home') || this.router.url.startsWith('/_featureflag')) {
      return this._defaultContext;
    } else if (this.router.url.startsWith('/_error')) {
      return null;
    } else {
      return this._context;
    }
  }

  get isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

  get isAppLauncherPage(): boolean {
    return (this.router.url.indexOf('applauncher') !== -1);
  }

  private stripQueryFromUrl(url: string) {
    if (url.indexOf('?q=') !== -1) {
      url = url.substring(0, url.indexOf('?q='));
    }
    return url;
  }

  private updateMenus(): void {
    if (this.context && this.context.type && this.context.type.hasOwnProperty('menus')) {
      let foundPath: boolean = false;
      let url: string = this.stripQueryFromUrl(this.router.url);
      let menus = (this.context.type as MenuedContextType).menus;
      for (let n of menus) {
        // Clear the menu's active state
        n.active = false;
        if (this.menuCallbacks.has(n.path)) {
          this.menuCallbacks.get(n.path)(this, n).subscribe(val => n.hide = val);
        }
        // lets go in reverse order to avoid matching
        // /namespace/space/create instead of /namespace/space/create/pipelines
        // as the 'Create' page matches to the 'Codebases' page
        let subMenus: MenuItem[] = (n.menus || []).slice().reverse();
        if (subMenus && subMenus.length > 0) {
          for (let o of subMenus) {
            // Clear the menu's active state
            o.active = false;
            if (!foundPath && o.fullPath === decodeURIComponent(url)) {
              foundPath = true;
              o.active = true;
              n.active = true;
            }
            if (this.menuCallbacks.has(o.path)) {
              this.menuCallbacks.get(o.path)(this, o).subscribe(val => o.hide = val);
            }
          }
          if (!foundPath) {
            // lets check if the URL matches part of the path
            for (let o of subMenus) {
              if (!foundPath && decodeURIComponent(url).startsWith(o.fullPath + '/')) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path)) {
                this.menuCallbacks.get(o.path)(this, o).subscribe(val => o.hide = val);
              }
            }
          }
          if (!foundPath && this.router.routerState.snapshot.root.firstChild) {
            // routes that can't be correctly matched based on the url should use the parent path
            for (let o of subMenus) {
              let parentPath = decodeURIComponent('/' + this.router.routerState.snapshot.root.firstChild.url.join('/'));
              if (!foundPath && o.fullPath === parentPath) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path)) {
                this.menuCallbacks.get(o.path)(this, o).subscribe(val => o.hide = val);
              }
            }
          }
        } else if (!foundPath && n.fullPath === url) {
          n.active = true;
          foundPath = true;
        }
      }
    }
  }

  private checkContextUserEqualsLoggedInUser(): Observable<boolean> {
    return observableCombineLatest(
      observableOf(this.context).pipe(map((val: Context) => val.user.id)),
      this.userService.loggedInUser.pipe(map((val: User) => val.id)),
      (a, b) => (a !== b)
    );
  }

  private loggedInUserNotSpaceAdmin(): Observable<boolean> {
    return this.permissionService
      .hasScope(this.context.space.id, 'manage')
      .pipe(map(val => !val));
  }

}
