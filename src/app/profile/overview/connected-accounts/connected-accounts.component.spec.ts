import { ConnectedAccountsComponent } from './connected-accounts.component';

import { AuthenticationService } from 'ngx-login-client';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { initContext, TestContext } from '../../../../testing/test-context';
import { ProviderService } from '../../../shared/account/provider.service';
import { UserService } from 'ngx-login-client';

@Component({
  template: `<alm-connected-accounts></alm-connected-accounts>`
})
class SampleTestComponent {}

describe('Connected Accounts Component', () => {

  const expectedOsoUser: string = 'oso-test-user';
  const ctx: any = {
    user: {
      attributes: {
        username: expectedOsoUser
      }
    }
  };

  type Context = TestContext<ConnectedAccountsComponent, SampleTestComponent>;

  describe('User has only GitHub account connected', () => {

    let contextsMock: any = jasmine.createSpy('Contexts');
    let authMock: any = jasmine.createSpy('AuthenticationService');
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.empty();
      contextsMock.current = Observable.empty();
      userServiceMock.loggedInUser = Observable.empty();
      providersMock.getGitHubStatus.and.returnValue(Observable.of({'username': 'username'}));
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock }]
    });

    it('should have GitHub connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('username');

    });

    it('should have absence of OpenShift connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift Not Connected');
    });

  });

  describe('User has only OpenShift account connected', () => {

    let contextsMock: any = jasmine.createSpy('Contexts');
    let authMock: any = jasmine.createSpy('AuthenticationService');
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.empty();
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);
      userServiceMock.loggedInUser = Observable.empty();
      providersMock.getGitHubStatus.and.returnValue(Observable.throw('failure'));
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock }]
    });

    it('should have absence of GitHub connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('GitHub Disconnected');
    });

    it('should have OpenShift connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });

  });

  describe('User has both Github and OpenShift accounts connected', () => {

    let contextsMock: any = jasmine.createSpy('Contexts');
    let authMock: any = jasmine.createSpy('AuthenticationService');
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);
      userServiceMock.loggedInUser = Observable.empty();
      providersMock.getGitHubStatus.and.returnValue(Observable.of({'username': 'username'}));
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock }]
    });

    it('should have GitHub connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('username');
    });

    it('should have OpenShift connection indicated', function(this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });
  });

});

function trimCarriageReturns(str: string) {
  return str.replace(/[\n\r]+/g, ' ');
}
