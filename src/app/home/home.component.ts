import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';

import { BrandInformation } from '../models/brand-information';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

// use url-loader for images
import fabric8Logo from '../../assets/images/fabric8_logo.png';
import openshiftLogo from '../../assets/images/OpenShift-io_logo.png';

import { FeatureTogglesService } from '../feature-flag/service/feature-toggles.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
  newHomeDashboardEnabled: boolean = false;
  subscriptions: Subscription[] = [];

  brandInformation: BrandInformation;
  loggedInUser: User;
  recent: Space[];
  modalRef: BsModalRef;
  private _context: Context;
  private _defaultContext: Context;
  private _spaces: Space[] = [];
  private _spaceSubscription: Subscription;
  private _loggedInUserSubscription: Subscription;
  private _contextSubscription: Subscription;
  private _contextDefaultSubscription: Subscription;
  private selectedFlow: string;
  private space: string;

  constructor(
    private featureTogglesService: FeatureTogglesService,
    private userService: UserService,
    private spaceService: SpaceService,
    private router: Router,
    private contexts: Contexts,
    private spaces: Spaces,
    private logger: Logger,
    private fabric8UIConfig: Fabric8UIConfig,
    private modalService: BsModalService,
    private authentication: AuthenticationService,
    private broadcaster: Broadcaster
  ) {
    this.space = '';
    this.selectedFlow = 'start';
    this._spaceSubscription = spaces.recent.subscribe(val => this.recent = val);
    this.subscriptions.push(featureTogglesService.getFeature('newHomeDashboard').subscribe((feature) => {
      this.newHomeDashboardEnabled = feature.attributes['enabled'] && feature.attributes['user-enabled'];
    }));
  }

  ngOnInit() {
    this._loggedInUserSubscription = this.userService.loggedInUser.subscribe(val => this.loggedInUser = val);
    this._contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
    });
    this._contextDefaultSubscription = this.contexts.default.subscribe(val => {
      this._defaultContext = val;
      this.initSpaces();
    });
    this.brandInformation = new BrandInformation();
    if (this.fabric8UIConfig.branding && this.fabric8UIConfig.branding === 'fabric8') {
      this.brandInformation.logo = fabric8Logo;
      // replace background image with fabric8 background once available
      this.brandInformation.backgroundClass = 'home-fabric8-background-image';
      this.brandInformation.description = 'A free, end-to-end, cloud-native development experience.';
      this.brandInformation.name = 'fabric8.io';
      this.brandInformation.moreInfoLink = 'https://fabric8.io/';
    } else {
      // default openshift.io branding
      this.brandInformation.logo = openshiftLogo;
      this.brandInformation.backgroundClass = 'home-header-background-image';
      this.brandInformation.description = 'A free, end-to-end, cloud-native development experience.';
      this.brandInformation.name = 'OpenShift.io';
      this.brandInformation.moreInfoLink = 'https://openshift.io/features.html';
    }
  }

  ngOnDestroy() {
    this._spaceSubscription.unsubscribe();
    this._loggedInUserSubscription.unsubscribe();
    this._contextSubscription.unsubscribe();
    this._contextDefaultSubscription.unsubscribe();
  }

  initSpaces() {
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, 5)
        .subscribe(spaces => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  get context(): Context {
    if (this.router.url.startsWith('/_home')) {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

  openForgeWizard(addSpace: TemplateRef<any>) {
    if (this.authentication.getGitHubToken()) {
      this.selectedFlow = 'start';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
    this.space = $event.space;
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }
}
