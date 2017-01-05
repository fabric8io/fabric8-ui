import './rxjs-extensions';

import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { DropdownModule } from 'ng2-dropdown';
import { LocalStorageModule } from 'angular-2-local-storage';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Footer
import { FooterComponent } from './footer/footer.component';

// Header
import { HeaderComponent } from './header/header.component';

// Shared Services
import { AuthenticationService } from './auth/authentication.service';
import { Broadcaster } from './shared/broadcaster.service';
import { DummyService } from './dummy/dummy.service';
import { Logger } from './shared/logger.service';
import { UserService } from './user/user.service';
import { ToggleService } from './toggle/toggle.service';
import { ContextService } from './shared/context.service';

// Share Modules
import { PublicModule } from './public/public.module';

// Shared Components
import { SpaceDialogModule } from './space-dialog/space-dialog.module';
import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';

// Login
import { SigninComponent } from './signin/signin.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

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
    SpaceDialogModule,
    // AppRoutingModule must appear last
    AppRoutingModule
  ],
  declarations: [ // declare which components, directives and pipes belong to the module
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    SigninComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AuthenticationService,
    Broadcaster,
    ContextService,
    DummyService,
    Logger,
    LoginService,
    ToggleService,
    UserService
  ],
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

