import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { LoginService } from '../shared/login.service';
import { LandingPageComponent } from './landing-page.component';


@Component({
  template: '<alm-landing-page></alm-landing-page>'
})
class HostComponent { }

describe('LandingPageComponent', () => {

  const testContext: TestContext<LandingPageComponent, HostComponent> = initContext(LandingPageComponent, HostComponent, {
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

  it('should use the auth service to check if the user is logged in', function() {
    expect(TestBed.get(AuthenticationService).isLoggedIn).toHaveBeenCalled();
  });

  it('should use the login service to redirect if the user is logged in', function() {
    expect(TestBed.get(LoginService).redirectAfterLogin).toHaveBeenCalled();
  });

  it('should broadcast and redirect upon login', function() {
    testContext.testedDirective.login();
    expect(TestBed.get(Broadcaster).broadcast).toHaveBeenCalledWith('login');
    expect(TestBed.get(LoginService).redirectToAuth).toHaveBeenCalled();
  });
});
