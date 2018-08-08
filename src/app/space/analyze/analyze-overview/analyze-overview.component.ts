import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { FeatureTogglesService } from 'ngx-feature-flag';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.less']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private loggedInUser: User;
  context: Context;
  private space: Space;
  private _myWorkItemsCard: boolean = false;
  private _userOwnsSpace: boolean = false;

  constructor(private authentication: AuthenticationService,
              private broadcaster: Broadcaster,
              private contexts: Contexts,
              private featureTogglesService: FeatureTogglesService,
              private userService: UserService) { }

  ngOnInit() {
    this.subscriptions.push(this.contexts.current.subscribe((ctx: Context) => {
      this.context = ctx;
      this.space = ctx.space;
    }));

    this.subscriptions.push(this.userService.loggedInUser.subscribe((user: User) => {
      this.loggedInUser = user;
    }));

    this.subscriptions.push(this.featureTogglesService.getFeature('Analyze.MyWorkItemsCard').subscribe((feature) => {
      if (feature.attributes['enabled'] && feature.attributes['user-enabled']) {
        this._myWorkItemsCard = true;
      }
    }));

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

  get myWorkItemsCard(): boolean {
    return this._myWorkItemsCard;
  }

  get userOwnsSpace(): boolean {
    return this._userOwnsSpace;
  }
}
