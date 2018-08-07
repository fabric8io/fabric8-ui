import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { LoginService } from '../shared/login.service';
import { LandingPageComponent } from './landing-page.component';

import { createMock } from 'testing/mock';

import {
  initContext,
  TestContext
} from 'testing/test-context';


@Component({
  template: '<alm-landing-page></alm-landing-page>'
})
class HostComponent { }

describe('LandingPageComponent', () => {
  type Context = TestContext<LandingPageComponent, HostComponent>;

  initContext(LandingPageComponent, HostComponent, {
    providers: [
      {
        provide: LoginService,
        useValue: jasmine.createSpyObj('LoginService', ['redirectAfterLogin', 'redirectToAuth'])
      },
      {
        provide: Broadcaster,
        useValue: jasmine.createSpyObj('Broadcaster', ['broadcast'])
      },
      {
        provide: AuthenticationService,
        useFactory: () => {
          let mockAuthenticationService = createMock(AuthenticationService);
          mockAuthenticationService.isLoggedIn.and.returnValue(true);

          return mockAuthenticationService;
        }
      }
    ]
  });

  it('should use the auth service to check if the user is logged in', function(this: Context) {
    expect(TestBed.get(AuthenticationService).isLoggedIn).toHaveBeenCalled();
  });

  it('should use the login service to redirect if the user is logged in', function(this: Context) {
    expect(TestBed.get(LoginService).redirectAfterLogin).toHaveBeenCalled();
  });

  it('should broadcast and redirect upon login', function(this: Context) {
    this.testedDirective.login();
    expect(TestBed.get(Broadcaster).broadcast).toHaveBeenCalledWith('login');
    expect(TestBed.get(LoginService).redirectToAuth).toHaveBeenCalled();
  });
});
