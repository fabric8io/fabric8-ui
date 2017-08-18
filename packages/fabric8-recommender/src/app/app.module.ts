import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL, SSO_API_URL } from 'ngx-login-client';

import { AppComponent }  from './app.component';
import { FormsModule }   from '@angular/forms';

import {AppRoutingModule} from './app.routing';

import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';
import { MockAuthenticationService } from './shared/mock-auth.service';

// Imports stackdetailsmodule
import { StackDetailsModule } from './stack/stack-details/stack-details.module';

@NgModule({
  imports: [
    BrowserModule,
    StackDetailsModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  providers: [
    Broadcaster,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    {
      provide: AuthenticationService, useClass: MockAuthenticationService
    },
    Contexts
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
