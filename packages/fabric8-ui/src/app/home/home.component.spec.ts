import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Broadcaster } from 'ngx-base';
import { UserService, AuthenticationService, User } from 'ngx-login-client';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { ActivatedRoute, Router } from '@angular/router';
import { of, ConnectableObservable } from 'rxjs';
import { LoginService } from '../shared/login.service';
import { HomeComponent } from './home.component';
import { ProviderService } from '../shared/account/provider.service';
import { ExtProfile } from './../getting-started/services/getting-started.service';

@Component({
  template: '<alm-home></alm-home>',
})
class HostComponent {}

describe('LandingPageComponent', () => {
  let mockExtProfile: ExtProfile;
  let mockUser: User;

  beforeEach(
    (): void => {
      mockExtProfile = {
        bio: 'mock-bio',
        company: 'mock-company',
        email: 'mock-email',
        emailPrivate: false,
        fullName: 'mock-fullName',
        imageURL: 'mock-imageUrl',
        url: 'mock-url',
        username: 'mock-username',
        cluster: 'mock-cluster',
        contextInformation: {
          pins: {
            myspaces: [],
          },
        },
        registrationCompleted: true,
        featureLevel: 'mock-featureLevel',
      } as ExtProfile;

      mockUser = {
        attributes: mockExtProfile,
        id: 'mock-id',
        type: 'mock-type',
      } as User;
    },
  );

  const testHomeContext: TestContext<HomeComponent, HostComponent> = initContext(
    HomeComponent,
    HostComponent,
    {
      providers: [
        {
          provide: UserService,
          useFactory: (): jasmine.SpyObj<UserService> => {
            const mockUserService: jasmine.SpyObj<UserService> = createMock(UserService);
            mockUserService.loggedInUser = of(mockUser) as ConnectableObservable<User> &
              jasmine.Spy;
            return mockUserService;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
        {
          provide: ProviderService,
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
          },
        },
        {
          provide: AuthenticationService,
          useFactory: () => {
            const mockAuthenticationService = createMock(AuthenticationService);
            mockAuthenticationService.isLoggedIn.and.returnValue(true);
            mockAuthenticationService.isOpenShiftConnected.and.returnValue(of(true));

            return mockAuthenticationService;
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    },
  );

  it('should create home component', () => {
    expect(testHomeContext).toBeDefined();
  });

  it('should have a defined user after login', () => {
    const homeComponent: HomeComponent = testHomeContext.testedDirective;
    expect(homeComponent.loggedInUser).toBeDefined();
  });

  it('should stop loading after resolving', () => {
    const homeComponent: HomeComponent = testHomeContext.testedDirective;
    expect(homeComponent.loading).toBeFalsy();
  });
});
