import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import './rxjs-extensions';

import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { RestangularModule } from 'ng2-restangular';
import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  AreaService,
  CollaboratorService,
  Contexts,
  Spaces,
  SpaceService
} from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  HttpService,
  UserService
} from 'ngx-login-client';
import { WidgetsModule } from 'ngx-widgets';
import {
  ActionModule,
  ChartModule,
  EmptyStateModule,
  ListModule,
  PatternFlyNgModule,
  TreeListComponent
} from 'patternfly-ng';
import {
  // Base functionality for the runtime console
  KubernetesRestangularModule,
  KubernetesStoreModule,
  OnLogin,
  SpaceNamespace, StatusListModule
} from '../a-runtime-console/index';

/*
 * Platform and Environment providers/directives/pipes
 */
import { AppRoutingModule } from './app-routing.module';
import { ENV_PROVIDERS }    from './environment';

// App is our top level component
import { AppComponent }                from './app.component';
import { APP_RESOLVER_PROVIDERS }      from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Footer & Header
import { ExpFeatureBannerComponent } from './exp-feature-page/exp-feature-banner.component';
import { ExpFeaturePageComponent } from './exp-feature-page/exp-feature-page.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenusService }    from './layout/header/menus.service';

// Shared Services
import { AboutService }                  from './shared/about.service';
import { ProviderService }               from './shared/account/provider.service';
import { AnalyticService }               from './shared/analytics.service';
import { ApiLocatorService }             from './shared/api-locator.service';
import { authApiUrlProvider }            from './shared/auth-api.provider';
import { AuthGuard }                     from './shared/auth-guard.service';
import { BrandingService }               from './shared/branding.service';
import { AuthUserResolve }               from './shared/common.resolver';
import { fabric8UIConfigProvider }       from './shared/config/fabric8-ui-config.service';
import { ContextCurrentUserGuard }       from './shared/context-current-user-guard.service';
import { ContextResolver }               from './shared/context-resolver.service';
import { ContextService }                from './shared/context.service';
import { DummyService }                  from './shared/dummy.service';
import { EventService }                  from './shared/event.service';
import { ExperimentalFeatureResolver }   from './shared/experimental-feature.resolver';
import { Fabric8UIHttpService }          from './shared/fabric8-ui-http.service';
import { forgeApiUrlProvider }           from './shared/forge-api.provider';
import { LoginService }                  from './shared/login.service';
import { NotificationsService }          from './shared/notifications.service';
import { ProfileResolver }               from './shared/profile-resolver.service';
import { realmProvider }                 from './shared/realm-token.provider';
import { Fabric8RuntimeConsoleService }  from './shared/runtime-console/fabric8-runtime-console.service';
import { Fabric8UIOnLogin }              from './shared/runtime-console/fabric8-ui-onlogin.service';
import { Fabric8UISpaceNamespace }       from './shared/runtime-console/fabric8-ui-space-namespace.service';
import { Fabric8RuntimeConsoleResolver } from './shared/runtime-console/oauth-config-store-guard.resolver';
import { OAuthConfigStoreGuard }         from './shared/runtime-console/oauth-config-store-guard.service';
import { PipelinesService }              from './shared/runtime-console/pipelines.service';
import { SpaceNamespaceService }         from './shared/runtime-console/space-namespace.service';
import { SpacesService }                 from './shared/spaces.service';
import { ssoApiUrlProvider }             from './shared/sso-api.provider';
import { witApiUrlProvider }             from './shared/wit-api.provider';

// Component Services
import { ConfigStore }               from './base/config.store';
import { ErrorService }              from './layout/error/error.service';
import { ProfileService }            from './profile/profile.service';
import { SpaceWizardModule }         from './space/wizard/space-wizard.module';

// About Modal
import { AboutModalModule } from './layout/about-modal/about-modal.module';

import { GettingStartedService } from './getting-started/services/getting-started.service';
import { ForgeWizardModule } from './space/forge-wizard/forge-wizard.module';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  imports: [
    // import (in alphabetical order) other modules with the components, directives and pipes
    // needed by the components in this module
    AboutModalModule,
    ActionModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    ChartModule,
    EmptyStateModule,
    FormsModule,
    HttpModule,
    KubernetesRestangularModule,
    KubernetesStoreModule,
    ListModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
    ModalModule.forRoot(),
    MomentModule,
    ReactiveFormsModule,
    RestangularModule,
    RouterModule,
    SpaceWizardModule,
    ForgeWizardModule,
    StackDetailsModule,
    WidgetsModule,
    PatternFlyNgModule,
    StatusListModule,
    // AppRoutingModule must appear last
    AppRoutingModule
  ],
  declarations: [ // declare which components, directives and pipes belong to the module
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ExpFeaturePageComponent,
    ExpFeatureBannerComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    // Broadcaster must come first
    Broadcaster,
    BsDropdownConfig,
    EventService,
    ENV_PROVIDERS,
    AboutService,
    AnalyticService,
    APP_PROVIDERS,
    ApiLocatorService,
    AreaService,
    authApiUrlProvider,
    AuthenticationService,
    AuthGuard,
    AuthUserResolve,
    BrandingService,
    CollaboratorService,
    ConfigStore,
    ContextCurrentUserGuard,
    ContextResolver,
    ContextService,
    {
      provide: Contexts,
      useExisting: ContextService
    },
    DummyService,
    ErrorService,
    ExperimentalFeatureResolver,
    Fabric8RuntimeConsoleResolver,
    Fabric8RuntimeConsoleService,
    {
      provide: Http,
      useClass: Fabric8UIHttpService
    },
    fabric8UIConfigProvider,
    {
      provide: OnLogin,
      useClass: Fabric8UIOnLogin
    },
    forgeApiUrlProvider,
    GettingStartedService,
    HttpService,
    Logger,
    LoginService,
    MenusService,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService
    },
    OAuthConfigStoreGuard,
    PipelinesService,
    ProfileResolver,
    ProfileService,
    ProviderService,
    SpacesService,
    SpaceService,
    {
      provide: Spaces,
      useExisting: SpacesService
    },
    SpaceNamespaceService,
    {
      provide: SpaceNamespace,
      useClass: Fabric8UISpaceNamespace
    },
    ssoApiUrlProvider,
    TreeListComponent,
    UserService,
    witApiUrlProvider,
    realmProvider
  ],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) { }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) { return; }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
