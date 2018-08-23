import {
  Component,
  DebugNode,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  Observable
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import {
  Broadcaster
} from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import {
  UserService
} from 'ngx-login-client';

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
  let fixture: ComponentFixture<HeaderComponent>;
  let component: DebugNode['componentInstance'];

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
      { provide: UserService, useValue: { loggedInUser: Observable.never() } },
      { provide: LoginService, useValue: jasmine.createSpyObj('LoginService', ['login']) },
      { provide: Broadcaster, useValue: mockBroadcaster },
      {
        provide: Contexts, useValue: {
          default: Observable.of({ name: 'default' }),
          current: Observable.of({ name: 'current' }),
          recent: Observable.never()
        }
      }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  beforeEach(() => {
    testRouter = TestBed.get(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
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
