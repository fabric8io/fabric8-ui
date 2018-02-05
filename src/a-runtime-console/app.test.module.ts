import { NgModule } from '@angular/core';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { LoginService } from './shared/login.service';
import { OnLogin } from './shared/onlogin.service';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from "ngx-base";
import { DevNamespaceScope, TestDevNamespaceScope } from "./kubernetes/service/devnamespace.scope";
let userServiceMock: any = jasmine.createSpy('UserService');
userServiceMock.currentLoggedInUser = {
  attributes: {
    username: 'username'
  }
};

@NgModule({
  providers: [
    AuthenticationService,
    Broadcaster,
    OnLogin,
    LoginService,
    Logger,
    { provide: UserService, useClass: userServiceMock },
    authApiUrlProvider,
    ssoApiUrlProvider,
    witApiUrlProvider,
    {
      provide: DevNamespaceScope,
      useClass: TestDevNamespaceScope
    }
  ]
})
export class TestAppModule { }
