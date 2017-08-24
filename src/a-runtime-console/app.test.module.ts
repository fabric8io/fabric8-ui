import { NgModule } from '@angular/core';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { LoginService } from './shared/login.service';
import { OnLogin } from './shared/onlogin.service';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import {Logger} from "ngx-base";
import {DevNamespaceScope, TestDevNamespaceScope} from "./kubernetes/service/devnamespace.scope";

@NgModule({
  providers: [
    AuthenticationService,
    Broadcaster,
    OnLogin,
    LoginService,
    Logger,
    authApiUrlProvider,
    ssoApiUrlProvider,
    witApiUrlProvider,
    {
      provide: DevNamespaceScope,
      useClass: TestDevNamespaceScope
    }
  ],
})
export class TestAppModule { }
