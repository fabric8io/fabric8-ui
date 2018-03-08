import { Component } from '@angular/core';

import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { initContext, TestContext } from '../../../../testing/test-context';
import { ProviderService } from '../../../shared/account/provider.service';
import { ConnectedAccountsComponent } from './connected-accounts.component';

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
    let authMock: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus', 'getOpenShiftStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      //authMock.openShiftToken = Observable.empty();
      authMock.isOpenShiftConnected.and.returnValue(Observable.of(false));
      contextsMock.current = Observable.empty();
      userServiceMock.loggedInUser = Observable.empty();
      userServiceMock.currentLoggedInUser = {};
      providersMock.getGitHubStatus.and.returnValue(Observable.of({'username': 'username'}));
      providersMock.getOpenShiftStatus.and.returnValue(Observable.throw('failure'));
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
    let authMock: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus', 'getOpenShiftStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.empty();
      //authMock.openShiftToken = Observable.of('oso-token');
      authMock.isOpenShiftConnected.and.returnValue(Observable.of(true));
      contextsMock.current = Observable.of(ctx);
      userServiceMock.loggedInUser = Observable.empty();
      userServiceMock.currentLoggedInUser = ctx.user;
      providersMock.getGitHubStatus.and.returnValue(Observable.throw('failure'));
      providersMock.getOpenShiftStatus.and.returnValue(Observable.of({'username': expectedOsoUser}));
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
    let authMock: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);
    let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus', 'getOpenShiftStatus']);
    let userServiceMock: any = jasmine.createSpy('UserService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      //authMock.openShiftToken = Observable.of('oso-token');
      authMock.isOpenShiftConnected.and.returnValue(Observable.of(true));
      contextsMock.current = Observable.of(ctx);
      userServiceMock.loggedInUser = Observable.empty();
      userServiceMock.currentLoggedInUser = ctx.user;
      providersMock.getGitHubStatus.and.returnValue(Observable.of({'username': 'username'}));
      providersMock.getOpenShiftStatus.and.returnValue(Observable.of({'username': expectedOsoUser}));
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
