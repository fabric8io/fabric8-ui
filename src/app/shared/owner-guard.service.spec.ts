import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { AuthenticationService, UserService, User } from 'ngx-login-client';

import { LoginService } from './login.service';
import { OwnerGuard } from './owner-guard.service';

describe('OwnerGuard', () => {
  describe('should not let in users not logged in', () => {
    let ownerGuard: OwnerGuard;
    let mockAuthService = { isLoggedIn: () => { return false; } };
    let mockLoginService = { redirectToLogin: () => { } };
    let mockRouter = { };
    let mockUserService = { };
    let mockRoute = { } as ActivatedRouteSnapshot;
    let mockState = { url: 'fakeUrl' } as RouterStateSnapshot;

    beforeEach(() => {
      spyOn(mockAuthService, 'isLoggedIn').and.callThrough();
      spyOn(mockLoginService, 'redirectToLogin').and.callThrough();

      TestBed.configureTestingModule({
        providers: [
          OwnerGuard,
          { provide: AuthenticationService, useValue: mockAuthService },
          { provide: LoginService, useValue: mockLoginService },
          { provide: Router, useValue: mockRouter },
          { provide: UserService, useValue: mockUserService },
        ]
      });
      ownerGuard = TestBed.get(OwnerGuard);
    });

    it('via root path', () => {
      ownerGuard.canActivate(mockRoute, mockState).subscribe(val => { expect(val).toBe(false); });
      expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      expect(mockLoginService.redirectToLogin).toHaveBeenCalledWith('fakeUrl');
    });

    it('via child path', () => {
      ownerGuard.canActivateChild(mockRoute, mockState).subscribe(val => { expect(val).toBe(false); });
      expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      expect(mockLoginService.redirectToLogin).toHaveBeenCalledWith('fakeUrl');
    });
  });

  describe('should handle logged in users', () => {
    const DEFAULT_USERNAME = 'user';
    const DIFFERENT_USERNAME = 'differentUser';
    let ownerGuard: OwnerGuard;
    let mockRoute = { } as ActivatedRouteSnapshot;
    let mockState = { } as RouterStateSnapshot;
    let mockUser = { attributes: { username: DEFAULT_USERNAME } } as User;
    let mockAuthService = { isLoggedIn: () => { return true; } };
    let mockUserService = { loggedInUser: Observable.of(mockUser) };
    let mockLoginService = { redirectToLogin: () => { } };

    let createMockRouterWithEntity = (username: string) => {
      return {
        routerState: {
          snapshot: {
            root: {
              firstChild: {
                params: {
                  entity: username
                }
              }
            }
          }
        }
      };
    };

    let firstTestConfig = {
      title: 'who are not the same and deny them access',
      username: DIFFERENT_USERNAME,
      expectedObserverResult: false
    };
    let secondTestConfig = {
      title: 'who are the same and provide them access',
      username: DEFAULT_USERNAME,
      expectedObserverResult: true
    };
    [firstTestConfig, secondTestConfig].forEach(config => {
      describe(config.title, () => {
        let mockRouter = createMockRouterWithEntity(config.username);

        beforeEach(() => {
          spyOn(mockAuthService, 'isLoggedIn').and.callThrough();

          TestBed.configureTestingModule({
            providers: [
              { provide: AuthenticationService, useValue: mockAuthService },
              { provide: LoginService, useValue: mockLoginService },
              { provide: Router, useValue: mockRouter },
              { provide: UserService, useValue: mockUserService },
              OwnerGuard
            ]
          });
          ownerGuard = TestBed.get(OwnerGuard);
        });

        it('via root path', () => {
          ownerGuard.canActivate(mockRoute, mockState).subscribe(val => {
            expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
            expect(val).toBe(config.expectedObserverResult);
          });
        });

        it('via child path', () => {
          ownerGuard.canActivateChild(mockRoute, mockState).subscribe(val => {
            expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
            expect(val).toBe(config.expectedObserverResult);
          });
        });
      });
    });
  });
});
