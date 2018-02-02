import { NgModule } from '@angular/core';
import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService, UserService } from 'ngx-login-client';

import { DevNamespaceScope, TestDevNamespaceScope } from './kubernetes/service/devnamespace.scope';
import { LoginService } from './shared/login.service';
import { OnLogin } from './shared/onlogin.service';

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
    {
      provide: DevNamespaceScope,
      useClass: TestDevNamespaceScope
    }
  ]
})
export class TestAppModule { }
