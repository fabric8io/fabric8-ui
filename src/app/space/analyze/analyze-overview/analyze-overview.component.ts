import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService  } from 'ngx-feature-flag';
import { AuthenticationService, User, UserService } from 'ngx-login-client';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {
  context: Context;
  _isUserEnabled: boolean;
  isLoggedIn: boolean;

  private loggedInUser: User;
  private _myWorkItemsCard: boolean = false;
  private _userOwnsSpace: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private broadcaster: Broadcaster,
    private contexts: Contexts,
    private featureTogglesService: FeatureTogglesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.contexts.current.subscribe((ctx: Context) => {
        this.context = ctx;
      })
    );

    this.subscriptions.push(
      this.userService.loggedInUser.subscribe((user: User) => {
        this.loggedInUser = user;
      })
    );

    this.subscriptions.push(
      this.featureTogglesService
        .getFeature('Analyze.newSpaceDashboard')
        .timeout(2000)
        .subscribe(
          (feature: Feature) => {
            this._isUserEnabled = feature.attributes.enabled && feature.attributes['user-enabled'];
          },
          () => {
            this._isUserEnabled = false;
          }
        )
    );

    this.subscriptions.push(
      this.featureTogglesService
        .getFeature('Analyze.MyWorkItemsCard')
        .subscribe((feature: Feature) => {
          if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
            this._myWorkItemsCard = true;
          }
        })
    );

    this._userOwnsSpace = this.checkSpaceOwner();
  }

  ngDoCheck() {
    // Must re-evaluate whenever user redirects from one space to another
    this._userOwnsSpace = this.checkSpaceOwner();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  isUserEnabled(): boolean {
    return this._isUserEnabled !== undefined && this._isUserEnabled;
  }

  isDefaultEnabled(): boolean {
    return this._isUserEnabled !== undefined && !this._isUserEnabled;
  }

  showAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', true);
  }

  checkSpaceOwner(): boolean {
    if (this.context && this.loggedInUser) {
      return this.context.space.relationships['owned-by'].data.id === this.loggedInUser.id;
    }
    return false;
  }

  get myWorkItemsCard(): boolean {
    return this._myWorkItemsCard;
  }

  get userOwnsSpace(): boolean {
    return this._userOwnsSpace;
  }
}
