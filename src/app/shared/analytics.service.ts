import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts, Spaces } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { Fabric8UIConfig } from './config/fabric8-ui-config';
import { NotificationsService } from './notifications.service';

declare global {
  interface Window {
    analytics: any;
  }
}

@Injectable()
export class AnalyticService {

  constructor(
    private fabric8UIConfig: Fabric8UIConfig,
    private broadcaster: Broadcaster,
    private userService: UserService,
    private router: Router,
    private contexts: Contexts,
    private notificationsService: NotificationsService,
    private spaces: Spaces
  ) {
    if (this.fabric8UIConfig.analyticsWriteKey) {
      this.initialize(this.fabric8UIConfig.analyticsWriteKey);
      this.track();
    }
  }

  get analytics(): SegmentAnalytics.AnalyticsJS {
    return window.analytics;
  }

  private track() {
    // Navigation
    this.broadcaster
      .on('navigate')
      .subscribe((navigation: { url: string }) => {
        if (navigation) {
          this.analytics.page(navigation.url);
        }
      });

    // User login and logout
    this.userService.loggedInUser
      .subscribe(user => {
        if (user && user.id) {
          this.identifyUser(user);
          this.analytics.track('logged in', {
            url: this.router.url
          });
        } else {
          this.analytics.track('logged out');
        }
      });

    this.broadcaster.on('login').subscribe(() =>
      this.analytics.track('login')
    );

    // Context change
    this.contexts.current.subscribe(context => {
      if (context && context.type) {
        this.analytics.track('change context', {
          path: context.path,
          type: context.type.name
        });
      }
    });

    // Space change
    this.spaces.current.subscribe(space => {
      if (space && space.relationalData && space.relationalData.creator && space.relationalData.creator.attributes) {
        this.analytics.track('change space', {
          name: space.name,
          owner: space.relationalData.creator.attributes.username
        });
      }
    });

    // Notifications
    this.notificationsService.stream
      .subscribe(notification => {
        if (notification) {
          this.analytics.track('receive notification', {
            message: notification.message,
            type: notification.type ? notification.type.cssClass : 'unknown'
          });
        }
      }
      );

    // Planner
    // TODO enrich properties
    this.broadcaster
      .on('unique_filter')
      .subscribe(val => this.analytics.track('reset filters', JSON.stringify(val)));
    this.broadcaster
      .on('item_filter')
      .subscribe(val => this.analytics.track('add filter', JSON.stringify(val)));

    // App Launcher
    this.activateLauncherEventListeners();
  }

  private initialize(apiWriteKey: string) {
    // THIS IS CODE DIRECTLY PASTED FROM SEGMENT
    let analytics = window.analytics = window.analytics || [];
    if (!analytics.initialize) {
      if (analytics.invoked) {
        window.console && console.error && console.error('Segment snippet included twice.');
      } else {
        analytics.invoked = !0;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on'
        ];
        analytics.factory = function(t) {
          return function() {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(t);
            analytics.push(e);
            return analytics;
          };
        };
        for (var t = 0; t < analytics.methods.length; t++) {
          var e = analytics.methods[t];
          analytics[e] = analytics.factory(e);
        }
        analytics.load = function(t) {
          var e = document.createElement('script');
          e.type = 'text/javascript';
          e.async = !0;
          e.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.segment.com/analytics.js/v1/' + t + '/analytics.min.js';
          var n = document.getElementsByTagName('script')[0];
          n.parentNode.insertBefore(e, n);
        };
        analytics.SNIPPET_VERSION = '4.0.0';
        analytics.load(apiWriteKey);
      }
    }
  }

  private identifyUser(user: any): any {
    let traits = {
      avatar: user.attributes.imageURL,
      email: user.attributes.email,
      username: user.attributes.username,
      website: user.attributes.url,
      name: user.attributes.fullName,
      description: user.attributes.bio
    };
    this.analytics.
      identify(
      user.id, traits);
  }

  private activateLauncherEventListeners(): void {
    this.broadcaster
      .on('showAddAppOverlay')
      .subscribe((val) => {
        if (val === true) {
          this.analytics.track('add app opened');
        } else {
          this.analytics.track('add app closed');
        }
      });
    this.broadcaster
      .on('clickContinueAppOverlay')
      .subscribe((data) => {
        this.analytics.track('click continue app overlay', data);
      });
    this.broadcaster
      .on('showCreateApp')
      .subscribe((val) => {
        if (val === true) {
          this.analytics.track('create app opened');
        } else {
          this.analytics.track('create app closed');
        }
      });
    this.broadcaster
      .on('showImportApp')
      .subscribe((val) => {
        if (val === true) {
          this.analytics.track('import app opened');
        } else {
          this.analytics.track('import app closed');
        }
      });
    this.broadcaster
      .on('completeMissionRuntimeStep')
      .subscribe((data: any) => {
        this.analytics.track('mission runtime completed', data);
      });
    this.broadcaster
      .on('completeDependencyEditorStep')
      .subscribe((data: any) => {
        this.analytics.track('dependency editor completed', data);
      });
    this.broadcaster
      .on('completePipelineStep_Create')
      .subscribe((data: any) => {
        this.analytics.track('pipeline completed in create', data);
      });
    this.broadcaster
      .on('completeGitProviderStep_Create')
      .subscribe((data: any) => {
        this.analytics.track('git provider completed in create', data);
      });
    this.broadcaster
      .on('completeSummaryStep_Create')
      .subscribe((data: any) => {
        this.analytics.track('summary completed in create', data);
      });
    this.broadcaster
      .on('completePipelineStep_Import')
      .subscribe((data: any) => {
        this.analytics.track('pipeline completed in import', data);
      });
    this.broadcaster
      .on('completeGitProviderStep_Import')
      .subscribe((data: any) => {
        this.analytics.track('git provider completed in import', data);
      });
    this.broadcaster
      .on('completeSummaryStep_Import')
      .subscribe((data: any) => {
        this.analytics.track('summary completed in import', data);
      });
    this.broadcaster
      .on('viewApplicationButtonClicked')
      .subscribe(() => {
        this.analytics.track('view application button clicked');
      });
    this.broadcaster
      .on('stepIndicatorClicked')
      .subscribe((data: any) => {
        this.analytics.track('step indicator clicked', data);
      });
    this.broadcaster
      .on('stepIndicatorProjectInputClicked')
      .subscribe((data: any) => {
        this.analytics.track('step indicator project name clicked');
      });
  }

}
