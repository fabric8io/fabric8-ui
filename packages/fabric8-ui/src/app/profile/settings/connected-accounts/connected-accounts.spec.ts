import { Component } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { empty, of, throwError } from 'rxjs';
import { initContext } from 'testing/test-context';
import { ProviderService } from '../../../shared/account/provider.service';
import { TenantService } from '../../services/tenant.service';
import { ConnectedAccountsComponent } from './connected-accounts.component';

@Component({
  template: `
    <alm-connected-accounts></alm-connected-accounts>
  `,
})
class SampleTestComponent {}

describe('Connected Accounts Component', () => {
  const expectedOsoUser: string = 'oso-test-user';
  const ctx: any = {
    user: {
      attributes: {
        username: expectedOsoUser,
      },
    },
  };

  const mockTenantData: any = {
    attributes: {
      namespaces: [
        {
          'cluster-console-url': 'http://example.cluster-name.something.com',
        },
      ],
    },
  };

  const contextsMock: any = jasmine.createSpy('Contexts');
  const authMock: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);
  const providersMock: any = jasmine.createSpyObj('ProviderService', [
    'getGitHubStatus',
    'getOpenShiftStatus',
  ]);
  const userServiceMock: any = jasmine.createSpy('UserService');
  const tenantSeriveMock: any = jasmine.createSpyObj('TenantService', ['getTenant']);

  describe('User has only OpenShift account connected', (): void => {
    beforeAll(
      (): void => {
        authMock.gitHubToken = empty();
        // authMock.openShiftToken = of('oso-token');
        authMock.isOpenShiftConnected.and.returnValue(of(true));
        contextsMock.current = of(ctx);
        userServiceMock.loggedInUser = empty();
        userServiceMock.currentLoggedInUser = ctx.user;
        providersMock.getGitHubStatus.and.returnValue(throwError('failure'));
        providersMock.getOpenShiftStatus.and.returnValue(of({ username: expectedOsoUser }));
        tenantSeriveMock.getTenant.and.returnValue(of(mockTenantData));
      },
    );

    const testContext = initContext(ConnectedAccountsComponent, SampleTestComponent, {
      imports: [TooltipModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock },
        { provide: TenantService, useValue: tenantSeriveMock },
      ],
    });

    it('should have absence of GitHub connection indicated', (): void => {
      const actualText: string = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp('GitHub\\s+Disconnected'));
    });

    it('should have OpenShift connection indicated', (): void => {
      const actualText: string = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp(expectedOsoUser));
    });

    it('should set cluster name and cluster url by calling tenant service', (): void => {
      expect(testContext.testedDirective.consoleUrl).toBe(
        'http://example.cluster-name.something.com',
      );
      expect(testContext.testedDirective.clusterName).toBe('cluster-name');
    });
  });

  describe('User has both Github and OpenShift accounts connected', (): void => {
    beforeAll(
      (): void => {
        authMock.gitHubToken = of('gh-test-user');
        // authMock.openShiftToken = of('oso-token');
        authMock.isOpenShiftConnected.and.returnValue(of(true));
        contextsMock.current = of(ctx);
        userServiceMock.loggedInUser = empty();
        userServiceMock.currentLoggedInUser = ctx.user;
        providersMock.getGitHubStatus.and.returnValue(of({ username: 'username' }));
        providersMock.getOpenShiftStatus.and.returnValue(of({ username: expectedOsoUser }));
      },
    );

    const testContext = initContext(ConnectedAccountsComponent, SampleTestComponent, {
      imports: [TooltipModule.forRoot()],
      providers: [
        { provide: AuthenticationService, useValue: authMock },
        { provide: Contexts, useValue: contextsMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProviderService, useValue: providersMock },
        { provide: TenantService, useValue: tenantSeriveMock },
      ],
    });

    it('should have GitHub connection indicated', (): void => {
      const actualText: string = testContext.testedElement.textContent;
      expect(actualText).toContain('username');
    });

    it('should have OpenShift connection indicated', (): void => {
      const actualText: string = testContext.testedElement.textContent;
      expect(actualText).toMatch(new RegExp(expectedOsoUser));
    });
  });
});
