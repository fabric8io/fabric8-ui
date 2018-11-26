import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { AuthenticationService, PermissionService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private loggedInUser: User;
  context: Context;
  private space: Space;
  private _userOwnsSpace: boolean = false;
  private _userIsSpaceAdmin: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private broadcaster: Broadcaster,
    private contexts: Contexts,
    private userService: UserService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.contexts.current.subscribe((ctx: Context) => {
      this.context = ctx;
      this.space = ctx.space;
      this.subscriptions.add(
        this.permissionService.hasScope(ctx.space.id, 'manage')
          .subscribe((isAdmin: boolean) => {
            this._userIsSpaceAdmin = isAdmin;
          })
      );
    }));

    this.subscriptions.add(this.userService.loggedInUser.subscribe((user: User) => {
      this.loggedInUser = user;
    }));

    this._userOwnsSpace = this.checkSpaceOwner();
  }

  ngDoCheck() {
    // Must re-evaluate whenever user redirects from one space to another
    this._userOwnsSpace = this.checkSpaceOwner();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
    this.broadcaster.broadcast('analyticsTracker', {
      event: 'add app opened',
      data: {
        source: 'analyze-overview'
      }
    });
  }

  checkSpaceOwner(): boolean {
    if (this.context && this.loggedInUser) {
      return this.context.space.relationships['owned-by'].data.id === this.loggedInUser.id;
    }
    return false;
  }

  get userIsSpaceAdmin(): boolean {
    return this._userIsSpaceAdmin;
  }

  get userOwnsSpace(): boolean {
    return this._userOwnsSpace;
  }
}
