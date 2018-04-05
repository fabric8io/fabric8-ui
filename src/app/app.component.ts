import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd, NavigationError, Router } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { ActionConfig } from 'patternfly-ng/action';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { Observable } from 'rxjs';

import { OnLogin } from '../a-runtime-console/index';
import { ErrorService } from './layout/error/error.service';
import { FeatureFlagConfig } from './models/feature-flag-config';
import { AboutService } from './shared/about.service';
import { ProviderService } from './shared/account/provider.service';
import { AnalyticService } from './shared/analytics.service';
import { BrandingService } from './shared/branding.service';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';

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
  public featureConfig: FeatureFlagConfig;
  public disconnectedStateConfig: EmptyStateConfig;
  private lastPageToTryGitHub: string;
  private showAddAppOverlay: boolean = false;
  private showAddSpaceOverlay: boolean = false;

  @ViewChild('connectToGithubModal') connectToGithubModal: TemplateRef<any>;

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
    private brandingService: BrandingService,
    private modalService: BsModalService,
    private providerService: ProviderService,
    private errorService: ErrorService,
    private logger: Logger
  ) {
  }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      this.loginService.login();
    });

    Observable.merge(
      this.router.events
        .filter((event: Event): boolean => event instanceof NavigationEnd)
        .filter((event: NavigationEnd): boolean => event.url !== '/_error')
        .filter((event: NavigationEnd): boolean => event.urlAfterRedirects === '/_error')
        .map((event: NavigationEnd): string => event.url),
      this.router.events
        .filter((event: Event): boolean => event instanceof NavigationError)
        .map((event: NavigationError): string => event.url)
    ).subscribe((url: string): void => this.handleNavigationError(url));

    this.router.errorHandler = this.logger.error;

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        // reset all experimental feature flag properties
        this.featureConfig = null;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        let routeTree = this.activatedRoute.snapshot;
        let featureFlagsInTree;

        while (routeTree.firstChild) {
          if (routeTree.data && routeTree.data['featureFlagConfig']) {
            featureFlagsInTree = routeTree.data['featureFlagConfig'];
          }
          routeTree = routeTree.firstChild;
        }

        if (event['featureFlagConfig'] || featureFlagsInTree) {
          let featureFlagConfig = event['featureFlagConfig'] as FeatureFlagConfig || featureFlagsInTree;
          this.featureConfig = featureFlagConfig;
        }
        let title = event['title'] ? `${event['title']} - ${this.brandingService.name}` : this.brandingService.name;
        this.titleService.setTitle(title);
      });

    this.broadcaster.on('showDisconnectedFromGitHub').subscribe((event) => {
      this.lastPageToTryGitHub = event['location'];
      this.showGitHubConnectModal();
    });

    this.broadcaster.on('showAddSpaceOverlay').subscribe((show: boolean) => {
      this.showAddSpaceOverlay = show;
    });

    this.broadcaster.on('showAddAppOverlay').subscribe((show: boolean) => {
      this.showAddAppOverlay = show;
    });

    this.disconnectedStateConfig = {
      actions: {
        primaryActions: [{
          id: 'connectAction',
          title: 'Connect to GitHub',
          tooltip: 'Connect to GitHub'
        }],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-info',
      title: 'GitHub Disconnected',
      info: 'You must be connected to GitHub in order to add to or create a Space'
    } as EmptyStateConfig;
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  showGitHubConnectModal(): void {
    this.modalService.show(this.connectToGithubModal, {class: 'modal-lg'});
  }

  connectToGithub(): void {
    this.providerService.linkGitHub(this.lastPageToTryGitHub);
  }

  private handleNavigationError(url: string): void {
    this.router.navigate(['_error']).then(() => this.errorService.updateFailedRoute(url));
  }
}
