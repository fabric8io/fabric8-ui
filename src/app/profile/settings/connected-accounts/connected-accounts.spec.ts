import { Component } from '@angular/core';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { UserService } from 'ngx-login-client';
import { empty as observableEmpty, Observable,  of ,  throwError as observableThrowError } from 'rxjs';
import { initContext, TestContext } from 'testing/test-context';

import { TooltipModule } from 'ngx-bootstrap';
import { ProviderService } from '../../../shared/account/provider.service';
import { TenantService } from '../../services/tenant.service';
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

  const mockTenantData: any = {
    attributes: {
      namespaces: [
        {
          'cluster-console-url': 'http://example.cluster-name.something.com'
        }
      ]
    }
  };

  type Context = TestContext<ConnectedAccountsComponent, SampleTestComponent>;

  let contextsMock: any = jasmine.createSpy('Contexts');
  let authMock: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);
  let providersMock: any  = jasmine.createSpyObj('ProviderService', ['getGitHubStatus', 'getOpenShiftStatus']);
  let userServiceMock: any = jasmine.createSpy('UserService');
  let tenantSeriveMock: any = jasmine.createSpyObj('TenantService', ['getTenant']);

  describe('User has only OpenShift account connected', () => {

    beforeAll(() => {
      authMock.gitHubToken = observableEmpty();
      //authMock.openShiftToken = of('oso-token');
      authMock.isOpenShiftConnected.and.returnValue(of(true));
      contextsMock.current = of(ctx);
      userServiceMock.loggedInUser = observableEmpty();
      userServiceMock.currentLoggedInUser = ctx.user;
      providersMock.getGitHubStatus.and.returnValue(observableThrowError('failure'));
      providersMock.getOpenShiftStatus.and.returnValue(of({'username': expectedOsoUser}));
      tenantSeriveMock.getTenant.and.returnValue(of(mockTenantData));
    });

    const testContext = initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      imports: [ TooltipModule.forRoot() ],
      providers: [
        { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock },
        { provide: TenantService, useValue: tenantSeriveMock}
      ]
    });

    it('should have absence of GitHub connection indicated', function() {
      const actualText = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp('GitHub\\s+Disconnected'));
    });

    it('should have OpenShift connection indicated', function() {
      const actualText = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp(expectedOsoUser));
    });

    it('should set cluster name and cluster url by calling tenant service', function(this: Context) {
      expect(testContext.testedDirective.consoleUrl).toBe('http://example.cluster-name.something.com');
      expect(testContext.testedDirective.clusterName).toBe('cluster-name');
    });
  });

  describe('User has both Github and OpenShift accounts connected', () => {

    beforeAll(() => {
      authMock.gitHubToken = of('gh-test-user');
      //authMock.openShiftToken = of('oso-token');
      authMock.isOpenShiftConnected.and.returnValue(of(true));
      contextsMock.current = of(ctx);
      userServiceMock.loggedInUser = observableEmpty();
      userServiceMock.currentLoggedInUser = ctx.user;
      providersMock.getGitHubStatus.and.returnValue(of({'username': 'username'}));
      providersMock.getOpenShiftStatus.and.returnValue(of({'username': expectedOsoUser}));
    });

    const testContext = initContext(ConnectedAccountsComponent, SampleTestComponent,  {
      imports: [ TooltipModule.forRoot() ],
      providers: [
        { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock },
        { provide: TenantService, useValue: tenantSeriveMock }
      ]
    });

    it('should have GitHub connection indicated', function() {
      const actualText = testContext.testedElement.textContent;
      expect(actualText).toContain('username');
    });

    it('should have OpenShift connection indicated', function() {
      const actualText = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp(expectedOsoUser));
    });
  });
});
