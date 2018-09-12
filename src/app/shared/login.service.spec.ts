import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { createMock } from 'testing/mock';

import {
  Broadcaster,
  Notifications
} from 'ngx-base';
import {
  AUTH_API_URL,
  AuthenticationService,
  UserService
} from 'ngx-login-client';

import { LoginService } from './login.service';
import { WindowService } from './window.service';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        LoginService,
        {
          provide: WindowService,
          useFactory: () => {
            const windowService: jasmine.SpyObj<WindowService> = createMock(WindowService);
            windowService.getNativeWindow.and.returnValue({});
            return windowService;
          }
        },
        { provide: LocalStorageService, useValue: createMock(LocalStorageService) },
        { provide: AUTH_API_URL, useValue: 'http://example.com' },
        {
          provide: Broadcaster,
          useFactory: () => {
            const broadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
            broadcaster.on.and.returnValue(Observable.never());
            return broadcaster;
          }
        },
        { provide: AuthenticationService, useValue: createMock(AuthenticationService) },
        { provide: Notifications, useValue: createMock(Notifications) },
        { provide: UserService, useValue: createMock(UserService) }
      ]
    });
  });

  describe('login', () => {
    describe('with "error" URL param', () => {
      it('should handle new login', () => {
        const windowService: jasmine.SpyObj<WindowService> = TestBed.get(WindowService);
        windowService.getNativeWindow.and.returnValue({
          location: {
            search: '?error=some_error&token_json=some_token'
          }
        });

        const authService: jasmine.SpyObj<AuthenticationService> = TestBed.get(AuthenticationService);
        authService.logIn.and.stub();
        authService.getOpenShiftToken.and.returnValue(of('some_token'));

        const notifications: jasmine.SpyObj<Notifications> = TestBed.get(Notifications);
        notifications.message.and.stub();

        const router: jasmine.SpyObj<Router> = TestBed.get(Router);
        const originalUrl: string = router.url;
        spyOn(router, 'navigateByUrl');

        const loginService: LoginService = TestBed.get(LoginService);

        expect(loginService.openShiftToken).toBeUndefined();

        loginService.login();

        expect(notifications.message).toHaveBeenCalled();
        expect(authService.logIn).toHaveBeenCalledWith('some_token');
        expect(loginService.openShiftToken).toEqual('some_token');
        expect(router.navigateByUrl).toHaveBeenCalledWith(originalUrl);
      });

      it('should handle existing login', () => {
        const windowService: jasmine.SpyObj<WindowService> = TestBed.get(WindowService);
        windowService.getNativeWindow.and.returnValue({
          location: {
            search: '?error=some_error'
          }
        });

        const authService: jasmine.SpyObj<AuthenticationService> = TestBed.get(AuthenticationService);
        authService.isLoggedIn.and.returnValue(true);
        authService.onLogIn.and.stub();
        authService.getOpenShiftToken.and.returnValue(of('mock-openshift-token'));

        const notifications: jasmine.SpyObj<Notifications> = TestBed.get(Notifications);
        notifications.message.and.stub();

        const loginService: LoginService = TestBed.get(LoginService);

        expect(loginService.openShiftToken).toBeUndefined();

        loginService.login();

        expect(notifications.message).toHaveBeenCalled();
        expect(authService.onLogIn).toHaveBeenCalled();
        expect(loginService.openShiftToken).toEqual('mock-openshift-token');
      });
    });
  });
});
