import { Location } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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
import { ErrorService } from './layout/error/error.service';

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
      { provide: BrandingService, useValue: createMock(BrandingService) },
      { provide: BsModalService, useValue: createMock(BsModalService) },
      { provide: ProviderService, useValue: createMock(ProviderService) },
      {
        provide: Broadcaster, useFactory: () => {
          const broadcaster: jasmine.SpyObj<Broadcaster> = createMock(Broadcaster);
          broadcaster.on.and.returnValue(Observable.never());
          return broadcaster;
        }
      },
      {
        provide: ErrorService, useFactory: () => {
          const svc: jasmine.SpyObj<ErrorService> = createMock(ErrorService);
          svc.updateFailedRoute.and.stub();
          return svc;
        }
      },
      {
        provide: Logger, useFactory: () => {
          const logger: jasmine.SpyObj<Logger> = createMock(Logger);
          logger.error.and.stub();
          return logger;
        }
      }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  it('should call ErrorService#updateFailedRoute on invalid URL', fakeAsync(() => {
    const testRouter: Router = TestBed.get(Router);
    const mockErrorService: jasmine.SpyObj<ErrorService> = TestBed.get(ErrorService);
    testRouter.navigate(['/nonexistent/app/path']).then((status: boolean): void => {
      expect(status).toBeTruthy();
      expect(testRouter.url).toEqual('/_error');
      tick();
      expect(mockErrorService.updateFailedRoute).toHaveBeenCalledWith('/nonexistent/app/path');
    });
    tick();
  }));
});
