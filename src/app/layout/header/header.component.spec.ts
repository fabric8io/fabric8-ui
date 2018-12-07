import {
  Component,
  DebugNode,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Broadcaster
} from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import {
  PermissionService, UserService
} from 'ngx-login-client';
import { never as observableNever, Observable,
  of as observableOf
} from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { LoginService } from '../../shared/login.service';
import { HeaderComponent } from './header.component';
import { MenusService } from './menus.service';

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
    return observableOf({
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

  const testContext: TestingContext = initContext(HeaderComponent, HostComponent, {
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
      { provide: UserService, useValue: { loggedInUser: observableNever() } },
      { provide: MenusService, useValue: jasmine.createSpyObj('MenusService', ['isFeatureUserEnabled']) },
      { provide: PermissionService, useValue:  jasmine.createSpyObj('PermissionService', ['hasScope']) },
      { provide: LoginService, useValue: jasmine.createSpyObj('LoginService', ['login']) },
      { provide: Broadcaster, useValue: mockBroadcaster },
      {
        provide: Contexts, useValue: {
          default: observableOf({ name: 'default' }),
          current: observableOf({ name: 'current' }),
          recent: observableNever()
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

  it('should return default context when in _home state', function(done: DoneFn) {
    testRouter.navigate(['_home']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(testContext.testedDirective.context.name).toEqual('default');
      done();
    });
  });

  it('should return default context when in _featureflag state', function(done: DoneFn) {
    testRouter.navigate(['_featureflag']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(testContext.testedDirective.context.name).toEqual('default');
      done();
    });
  });

  it('should return current context when in non-home valid state', function(done: DoneFn) {
    testRouter.navigate(['_other']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(testContext.testedDirective.context.name).toEqual('current');
      done();
    });
  });

  describe('_error state handling', () => {
    it('should return no context when directly visiting _error', function(done: DoneFn) {
      testRouter.navigate(['_error']).then((status: boolean): void => {
        expect(status).toBeTruthy();
        expect(testContext.testedDirective.context).toBeFalsy();
        done();
      });
    });

    it('should return no context when redirected to _error', function(done: DoneFn) {
      testRouter.navigateByUrl('/nonexistent/app/path').then((status: boolean): void => {
        expect(status).toBeTruthy();
        expect(testContext.testedDirective.context).toBeFalsy();
        done();
      });
    });
  });

});
