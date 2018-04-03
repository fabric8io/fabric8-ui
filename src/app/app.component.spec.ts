import { Location } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import {
  Observable,
  Subject
} from 'rxjs';

import { OnLogin } from 'a-runtime-console';
import { AboutService } from './shared/about.service';
import { ProviderService } from './shared/account/provider.service';
import { AnalyticService } from './shared/analytics.service';
import { BrandingService } from './shared/branding.service';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';

import { AppComponent } from './app.component';

@Component({
  template: '<f8-app></f8-app>'
})
class HostComponent { }

@Component({
  template: ''
})
class MockHomeComponent { }

@Component({
  template: ''
})
class MockErrorComponent { }

describe('AppComponent', () => {
  type Context = TestContext<AppComponent, HostComponent>;

  const mockBroadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
  mockBroadcaster.on.and.returnValue(Observable.never());

  let testRouter: Router;
  let testLocation: Location;

  initContext(AppComponent, HostComponent, {
    imports: [
      RouterTestingModule.withRoutes([
        { path: '_home', component: MockHomeComponent },
        { path: '_error', component: MockErrorComponent },
        { path: '**', redirectTo: '/_error' }
      ])
    ],
    declarations: [
      MockHomeComponent,
      MockErrorComponent
    ],
    providers: [
      {
        provide: AboutService, useValue: {
          buildVersion: '1.2.3',
          buildNumber: '123',
          buildTimestamp: '02468'
        }
      },
      { provide: LoginService, useValue: jasmine.createSpyObj('LoginService', ['login']) },
      { provide: NotificationsService, useValue: { actionSubject: new Subject<any>() } },
      { provide: Spaces, useValue: null },
      { provide: AnalyticService, useValue: null },
      { provide: OnLogin, useValue: null },
      { provide: AuthenticationService, useValue: null },
      { provide: Broadcaster, useValue: mockBroadcaster },
      { provide: BrandingService, useValue: createMock(BrandingService) },
      { provide: BsModalService, useValue: createMock(BsModalService) },
      { provide: ProviderService, useValue: createMock(ProviderService) }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  beforeEach(() => {
    testRouter = TestBed.get(Router);
    testLocation = TestBed.get(Location);
  });

  it('should preserve URL on error state redirect', function(this: Context, done: DoneFn) {
    spyOn(testLocation, 'replaceState').and.callThrough();
    testRouter.navigate(['/nonexistent/app/path']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(testRouter.url).toEqual('/_error');
      expect(testLocation.replaceState).toHaveBeenCalledWith('/nonexistent/app/path');
      expect(testLocation.path()).toEqual('/nonexistent/app/path');
      done();
    });
  });
});
