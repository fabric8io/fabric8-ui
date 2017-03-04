import { recommenderApiUrlProvider } from './shared/recommender-api.provider';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { witApiUrlProvider } from './shared/wit-api.provider';
import './rxjs-extensions';

import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { LocalStorageModule } from 'angular-2-local-storage';
import { PlannerModule } from 'fabric8-planner';
import { DropdownModule } from 'ngx-dropdown';
import { AuthenticationService, Broadcaster, Logger, UserService, HttpService } from 'ngx-login-client';
import { WidgetsModule } from 'ngx-widgets';

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
import { ContextCurrentUserAuthGuard } from './shared/context-current-user-auth-guard.service';
import { DummyService } from './shared/dummy.service';
import { LoginService } from './shared/login.service';
import { ToggleService } from './toggle/toggle.service';
import { ContextService } from './shared/context.service';
import { AboutService } from './shared/about.service';

// Shared Components
import { SpaceWizardModule } from './space-wizard/space-wizard.module';
import { PublicModule } from './public/public.module';
import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';
import { StackDetailsModule } from './analyze/stack/stack-details/stack-details.module';

// Component Services
import { ProfileService } from './profile/profile.service';
import { SpaceService } from 'ngx-fabric8-wit';
import {AuthUserResolve} from './shared/common.resolver';

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
    BrowserModule,
    DeleteAccountDialogModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
    PublicModule,
    SpaceWizardModule,
    StackDetailsModule,
    ReactiveFormsModule,
    WidgetsModule,
    // AppRoutingModule must appear last
    AppRoutingModule
  ],
  declarations: [ // declare which components, directives and pipes belong to the module
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ApiLocatorService,
    authApiUrlProvider,
    AuthenticationService,
    AuthGuard,
    Broadcaster,
    ContextCurrentUserAuthGuard,
    ContextService,
    DummyService,
    Logger,
    LoginService,
    ProfileService,
    recommenderApiUrlProvider,
    ToggleService,
    UserService,
    witApiUrlProvider,
    AboutService,
    SpaceService,
    AuthUserResolve,
    {
      provide: Http,
      useClass: HttpService
    }
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
