import { ConnectedAccountsComponent } from './connected-accounts.component';

import { AuthenticationService } from 'ngx-login-client';
import { Contexts } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { initContext, TestContext } from '../../../../testing/test-context';

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

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.empty();
      contextsMock.current = Observable.empty();
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock }]
    });

    it('should have GitHub connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('GitHub Connected');

    });

    it('should have absence of OpenShift connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift Not Connected');
    });

  });

  describe('User has only OpenShift account connected', () => {

    let contextsMock: any = jasmine.createSpy('Contexts');
    let authMock: any = jasmine.createSpy('AuthenticationService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.empty();
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock }]
    });

    it('should have absence of GitHub connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('GitHub Not Connected');
    });

    it('should have OpenShift connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });

  });

  describe('User has both Github and OpenShift accounts connected', () => {

    let contextsMock: any = jasmine.createSpy('Contexts');
    let authMock: any = jasmine.createSpy('AuthenticationService');

    beforeAll(() => {
      authMock.gitHubToken = Observable.of('gh-test-user');
      authMock.openShiftToken = Observable.of('oso-token');
      contextsMock.current = Observable.of(ctx);
    });

    initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      providers: [ { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock }]
    });

    it('should have GitHub connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('GitHub Connected');
    });

    it('should have OpenShift connection indicated', function (this: Context) {
      let actualText = trimCarriageReturns(this.testedElement.innerText);
      expect(actualText).toContain('OpenShift ' + expectedOsoUser);
    });
  });

});

function trimCarriageReturns(str: string) {
  return str.replace(/[\n\r]+/g, ' ');
}
