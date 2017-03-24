import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { AuthenticationService, Broadcaster, AUTH_API_URL } from 'ngx-login-client';
import { Contexts } from 'ngx-fabric8-wit';

import { StackDetailsModule } from './stack/stack-details/stack-details.module';

@NgModule({
  imports:      [ BrowserModule, StackDetailsModule ],
  declarations: [ AppComponent ],
  providers: [
    Broadcaster,
    AuthenticationService,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    Contexts
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
