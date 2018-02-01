import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';
import { cloneDeep } from 'lodash';
import { ContextService } from './context.service';
import { LoginService } from './login.service';
import { OwnerGuard } from './owner-guard.service';

describe('OwnerGuard', () => {
  describe('should not let in users not logged in', () => {
    const FAKE_URL = 'fakeUrl';
    let ownerGuard: OwnerGuard;
    let mockAuthService = { isLoggedIn: () => { return false; } };
    let mockContext = { };
    let mockLoginService = { redirectToLogin: () => { } };
    let mockRoute = { } as ActivatedRouteSnapshot;
    let mockState = { url: FAKE_URL } as RouterStateSnapshot;

    beforeEach(() => {
      spyOn(mockAuthService, 'isLoggedIn').and.callThrough();
      spyOn(mockLoginService, 'redirectToLogin').and.callThrough();

      TestBed.configureTestingModule({
        providers: [
          OwnerGuard,
          { provide: AuthenticationService, useValue: mockAuthService },
          { provide: ContextService, useValue: mockContext },
          { provide: LoginService, useValue: mockLoginService }
        ]
      });
      ownerGuard = TestBed.get(OwnerGuard);
    });

    it('via root path', () => {
      expect(ownerGuard.canActivateChild(mockRoute, mockState)).toBeFalsy();
      expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      expect(mockLoginService.redirectToLogin).toHaveBeenCalledWith(FAKE_URL);
    });

    it('via child path', () => {
      expect(ownerGuard.canActivateChild(mockRoute, mockState)).toBeFalsy();
      expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      expect(mockLoginService.redirectToLogin).toHaveBeenCalledWith(FAKE_URL);
    });
  });

  describe('should handle logged in users', () => {
    let ownerGuard: OwnerGuard;
    let mockAuthService = { isLoggedIn: () => { return true; } };
    let mockLoginService = { redirectToLogin: () => { } };
    let mockRoute = { } as ActivatedRouteSnapshot;
    const activatedRoute = {
      url: null,
      root: null,
      children: null,
      queryParams: null,
      pathFromRoot: null,
      fragment: null,
      params: null,
      data: null,
      outlet: null,
      component: null,
      routeConfig: null,
      parent: null,
      paramMap: null,
      queryParamMap: null,
      firstChild: null
    } as ActivatedRouteSnapshot;
    let child = cloneDeep(activatedRoute);
    child.params = {entity: 'me'};
    let mockState = {
      url: '',
      root: {
        url: null,
        root: null,
        children: null,
        queryParams: null,
        pathFromRoot: null,
        fragment: null,
        params: null,
        data: null,
        outlet: null,
        component: null,
        routeConfig: null,
        parent: null,
        paramMap: null,
        queryParamMap: null,
        firstChild: child
      }
    } as RouterStateSnapshot;

    describe('should handle logged in users who are not viewing their own context', () => {
      let mockContextService = { currentUser: 'not_me' };

      beforeEach(() => {
        spyOn(mockAuthService, 'isLoggedIn').and.callThrough();

        TestBed.configureTestingModule({
          providers: [
            OwnerGuard,
            { provide: AuthenticationService, useValue: mockAuthService },
            { provide: ContextService, useValue: mockContextService },
            { provide: LoginService, useValue: mockLoginService }
          ]
        });
        ownerGuard = TestBed.get(OwnerGuard);
      });

      it('via root path', () => {
        expect(ownerGuard.canActivate(mockRoute, mockState)).toBeFalsy();
        expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      });

      it('via child path', () => {
        expect(ownerGuard.canActivate(mockRoute, mockState)).toBeFalsy();
        expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      });
    });

    describe('should handle logged in users who are viewing their own context', () => {
      let mockContextService = { currentUser: 'me' };
      beforeEach(() => {
        spyOn(mockAuthService, 'isLoggedIn').and.callThrough();

        TestBed.configureTestingModule({
          providers: [
            OwnerGuard,
            { provide: AuthenticationService, useValue: mockAuthService },
            { provide: ContextService, useValue: mockContextService },
            { provide: LoginService, useValue: mockLoginService }
          ]
        });
        ownerGuard = TestBed.get(OwnerGuard);
      });

      it('via root path', () => {
        expect(ownerGuard.canActivate(mockRoute, mockState)).toBeTruthy();
        expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      });

      it('via child path', () => {
        expect(ownerGuard.canActivate(mockRoute, mockState)).toBeTruthy();
        expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
      });
    });
  });
});
