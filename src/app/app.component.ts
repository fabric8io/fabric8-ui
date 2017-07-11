import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { OnLogin } from 'fabric8-runtime-console';
import { AnalyticService } from './shared/analytics.service';
import { Spaces } from 'ngx-fabric8-wit';
/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AboutService } from './shared/about.service';
import { NotificationsService } from './shared/notifications.service';
import { LoginService } from './shared/login.service';
import { BrandingService } from './shared/branding.service';
import { FeatureFlagConfig } from './models/feature-flag-config';


/*
 * App Component
 * Top Level Component
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-app',
  styleUrls: ['./app.component.less'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public disableRoute: boolean;


  constructor(
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
    // Inject services that need to start listening
    private spaces: Spaces,
    private analytics: AnalyticService,
    private onLogin: OnLogin,
    private authService: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private titleService: Title,
    private brandingService: BrandingService
  ) {
  }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      this.loginService.login();
    });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.disableRoute = false;
        if (event['featureFlagConfig']) {
          let featureFlagConfig = event['featureFlagConfig'] as FeatureFlagConfig;
          this.disableRoute = !featureFlagConfig.enabled;
        }
        let title = event['title'] ? `${event['title']} - ${this.brandingService.name}` : this.brandingService.name;
        this.titleService.setTitle(title);
      });
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
