import './rxjs-extensions';

import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { LocalStorageModule } from 'angular-2-local-storage';
import { PlannerModule } from 'fabric8-planner';
import { Broadcaster, Logger } from 'ngx-base';
import { DropdownModule } from 'ngx-dropdown';
import { AuthenticationService, UserService, HttpService } from 'ngx-login-client';
import { WidgetsModule } from 'ngx-widgets';
import { MomentModule } from 'angular2-moment';


/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Footer & Header
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

// Shared Services
import { ApiLocatorService } from './shared/api-locator.service';
import { AuthGuard } from './shared/auth-guard.service';
import { ContextCurrentUserGuard } from './shared/context-current-user-guard.service';
import { ContextResolver } from './shared/context-resolver.service';
import { DummyService } from './shared/dummy.service';
import { LoginService } from './shared/login.service';
import { ToggleService } from './toggle/toggle.service';
import { ContextService } from './shared/context.service';
import { AboutService } from './shared/about.service';
import { SpacesService } from './shared/spaces.service';
import { MenusService } from './header/menus.service';
import { NotificationsService } from './shared/notifications.service';

// Shared Components
import { SpaceWizardModule } from './space-wizard/space-wizard.module';
import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { forgeApiUrlProvider } from './shared/forge-api.provider';
import { PipelinesService } from './shared/runtime-console/pipelines.service';
import { Fabric8RuntimeConsoleResolver } from './shared/runtime-console/oauth-config-store-guard.resolver';


// Component Services
import { ProfileService } from './profile/profile.service';
import { Notifications } from 'ngx-base';
import { SpaceService, Contexts, Spaces, AreaService } from 'ngx-fabric8-wit';
import { AuthUserResolve } from './shared/common.resolver';

import { AnalyticService } from './shared/analytics.service';
import { ConfigStore } from './base/config.store';
import { fabric8UIConfigProvider } from './shared/config/fabric8-ui-config.service';
import { Fabric8UIOnLogin } from './shared/runtime-console/fabric8-ui-onlogin.service';



import {
  // Base functionality for the runtime console
  KubernetesStoreModule,
  KubernetesRestangularModule,
  PipelineModule,
  OnLogin,
  DevNamespaceScope,
  NamespaceScope
} from 'fabric8-runtime-console';
import { RestangularModule } from 'ng2-restangular';

import { Fabric8UIHttpService } from './shared/fabric8-ui-http.service';
import { OAuthConfigStoreGuard } from './shared/runtime-console/oauth-config-store-guard.service';
import { SpaceNamespaceScope } from './shared/runtime-console/space-namespace.scope';
import { Fabric8RuntimeConsoleService } from './shared/runtime-console/fabric8-runtime-console.service';
import { SpaceNamespaceService } from './shared/runtime-console/space-namespace.service';

// Login

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
  imports: [ // import (in alphabetical order) other modules with the components, directives and pipes needed by the components in this module
    BrowserAnimationsModule,
    BrowserModule,
    DeleteAccountDialogModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
    SpaceWizardModule,
    StackDetailsModule,
    ReactiveFormsModule,
    WidgetsModule,
    // AppRoutingModule must appear last
    AppRoutingModule,
    KubernetesStoreModule,
    RestangularModule,
    KubernetesRestangularModule,
    MomentModule
  ],
  declarations: [ // declare which components, directives and pipes belong to the module
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    // Broadcaster must come first
    Broadcaster,
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ApiLocatorService,
    AreaService,
    authApiUrlProvider,
    AuthenticationService,
    AuthGuard,
    ContextCurrentUserGuard,
    ContextService,
    {
      provide: Contexts,
      useExisting: ContextService
    },
    {
      provide: Spaces,
      useClass: SpacesService
    },
    ContextResolver,
    DummyService,
    forgeApiUrlProvider,
    Logger,
    LoginService,
    ProfileService,
    ToggleService,
    UserService,
    witApiUrlProvider,
    ssoApiUrlProvider,
    AboutService,
    SpaceService,
    AuthUserResolve,
    HttpService,
    {
      provide: Http,
      useClass: Fabric8UIHttpService
    },
    MenusService,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService
    },
    fabric8UIConfigProvider,
    ConfigStore,
    AnalyticService,
    {
      provide: DevNamespaceScope,
      useClass: SpaceNamespaceScope
    },
    OAuthConfigStoreGuard,
    Fabric8RuntimeConsoleResolver,
    SpaceNamespaceService,
    Fabric8RuntimeConsoleService,
    {
      provide: OnLogin,
      useClass: Fabric8UIOnLogin
    },
    PipelinesService
  ],
  schemas: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) { }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
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
