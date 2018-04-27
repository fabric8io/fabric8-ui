import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ConnectableObservable,
  Observable
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import {
  Broadcaster,
  Logger
} from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Contexts } from 'ngx-fabric8-wit';
import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';

import { FeatureTogglesService } from '../../feature-flag/service/feature-toggles.service';
import { LoginService } from '../../shared/login.service';

import { HeaderComponent } from './header.component';

@Component({
  template: '<alm-app-header></alm-app-header>'
})
class HostComponent { }

@Component({
  template: ''
})
class MockRoutedComponent { }

class MockFeatureToggleService {
  getFeature(featureName: string): Observable<any> {
    return Observable.of({
      attributes: {
        enabled: true,
        userEnabled: true
      }
    });
  }
}

describe('HeaderComponent', () => {
  type TestingContext = TestContext<HeaderComponent, HostComponent>;

  const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
  mockBroadcaster.broadcast.and.stub();

  let testRouter: Router;

  initContext(HeaderComponent, HostComponent, {
    imports: [
      RouterTestingModule.withRoutes([
        { path: '_home', component: MockRoutedComponent },
        { path: '_featureflag', component: MockRoutedComponent },
        { path: '_error', component: MockRoutedComponent },
        { path: '_other', component: MockRoutedComponent },
        { path: '**', redirectTo: '/_error' }
      ])
    ],
    declarations: [ MockRoutedComponent ],
    providers: [
      { provide: FeatureTogglesService, useClass: MockFeatureToggleService },
      { provide: UserService, useValue: { loggedInUser: Observable.never() } },
      { provide: Logger, useValue: createMock(Logger) },
      { provide: LoginService, useValue: jasmine.createSpyObj('LoginService', ['login']) },
      { provide: Broadcaster, useValue: mockBroadcaster },
      {
        provide: Contexts, useValue: {
          default: Observable.of({ name: 'default' }),
          current: Observable.of({ name: 'current' }),
          recent: Observable.never()
        }
      },
      { provide: BsModalService, useValue: createMock(BsModalService) },
      { provide: AuthenticationService, useValue: createMock(AuthenticationService) }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  beforeEach(() => {
    testRouter = TestBed.get(Router);
  });

  it('should return default context when in _home state', function(this: TestingContext, done: DoneFn) {
    testRouter.navigate(['_home']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(this.testedDirective.context.name).toEqual('default');
      done();
    });
  });

  it('should return default context when in _featureflag state', function(this: TestingContext, done: DoneFn) {
    testRouter.navigate(['_featureflag']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(this.testedDirective.context.name).toEqual('default');
      done();
    });
  });

  it('should return current context when in non-home valid state', function(this: TestingContext, done: DoneFn) {
    testRouter.navigate(['_other']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(this.testedDirective.context.name).toEqual('current');
      done();
    });
  });

  describe('_error state handling', () => {
    it('should return no context when directly visiting _error', function(this: TestingContext, done: DoneFn) {
      testRouter.navigate(['_error']).then((status: boolean): void => {
        expect(status).toBeTruthy();
        expect(this.testedDirective.context).toBeFalsy();
        done();
      });
    });

    it('should return no context when redirected to _error', function(this: TestingContext, done: DoneFn) {
      testRouter.navigateByUrl('/nonexistent/app/path').then((status: boolean): void => {
        expect(status).toBeTruthy();
        expect(this.testedDirective.context).toBeFalsy();
        done();
      });
    });
  });
});
