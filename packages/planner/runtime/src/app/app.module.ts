import { EffectsModule } from '@ngrx/effects';
import './rxjs-extensions';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// FIXME: do we really need to have this modules on top-level?
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap';
import { TruncateModule } from 'ng2-truncate';

import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import {
  AuthenticationService,
  UserService,
  HttpService as HttpServiceLGC,
} from 'ngx-login-client';

import { HeaderModule, FooterModule, HeaderService } from 'osio-ngx-framework';

// Shared
import { GlobalSettings } from './shared/globals';
import { SpacesService } from './services/spaces.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { realmProvider } from './shared/realm-token.provider';

// Header
import { HeaderComponent } from './components/header/header.component';

// Login
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

let serviceImports: Array<any[] | any | ModuleWithProviders>;
let providers: any[] = [GlobalSettings, serviceImports];

serviceImports = [
  Logger,
  AuthenticationService,
  Broadcaster,
  LoginService,
  UserService,
  authApiUrlProvider,
  Notifications,
  HeaderService,
  {
    provide: Spaces,
    useExisting: SpacesService,
  },
  SpacesService,
  ssoApiUrlProvider,
];
providers = [
  GlobalSettings,
  witApiUrlProvider,
  realmProvider,
  serviceImports,
  {
    provide: Http,
    useClass: HttpServiceLGC,
  },
];

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    HttpModule,
    ModalModule,
    TabsModule,
    TooltipModule.forRoot(),
    TruncateModule,
    HeaderModule,
    FooterModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
    }),
    HeaderModule,
    FooterModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
    }),
  ],
  declarations: [AppComponent, HeaderComponent, LoginComponent],
  providers: providers,
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private globalSettings: GlobalSettings) {}
}
