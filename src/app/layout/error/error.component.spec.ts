import { Location } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import {
  Notifications,
  NotificationType
} from 'ngx-base';
import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';
import {
  Observable,
  Subject
} from 'rxjs';

import { ErrorComponent } from './error.component';
import { ErrorService } from './error.service';

@Component({
  template: '<f8-error></f8-error>'
})
class HostComponent { }

describe('ErrorComponent', () => {
  initContext(ErrorComponent, HostComponent, {
    providers: [
      ErrorService,
      { provide: UserService, useValue: createMock(UserService) },
      {
        provide: AuthenticationService, useFactory: () => {
          const authenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
          authenticationService.isLoggedIn.and.returnValue(false);
          return authenticationService;
        }
      },
      {
        provide: Notifications, useFactory: () => {
          const notifications: jasmine.SpyObj<Notifications> = createMock(Notifications);
          notifications.message.and.stub();
          return notifications;
        }
      },
      {
        provide: Location, useFactory: () => {
          const location: jasmine.SpyObj<Location> = createMock(Location);
          location.replaceState.and.stub();
          return location;
        }
      }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  });

  it('should send a notification if a failed route is available', function(this: TestContext<ErrorComponent, HostComponent>) {
    const notifications: Notifications = TestBed.get(Notifications);
    const errorService: ErrorService = TestBed.get(ErrorService);
    expect(notifications.message).not.toHaveBeenCalled();
    errorService.updateFailedRoute('/foo/path');
    expect(notifications.message).toHaveBeenCalledWith({
      message: '/foo/path not found',
      type: NotificationType.WARNING
    });
  });

  it('should not send a notification if failed route is unavailable', function(this: TestContext<ErrorComponent, HostComponent>) {
    const notifications: Notifications = TestBed.get(Notifications);
    const errorService: ErrorService = TestBed.get(ErrorService);
    expect(notifications.message).not.toHaveBeenCalled();
    errorService.updateFailedRoute('');
    expect(notifications.message).not.toHaveBeenCalled();
  });

  it('should replace location state if a failed route is available', function(this: TestContext<ErrorComponent, HostComponent>) {
    const location: Location = TestBed.get(Location);
    const errorService: ErrorService = TestBed.get(ErrorService);
    expect(location.replaceState).not.toHaveBeenCalled();
    errorService.updateFailedRoute('/foo/path');
    expect(location.replaceState).toHaveBeenCalledWith('/foo/path');
  });

  it('should not replace location state if failed route is unavailable', function(this: TestContext<ErrorComponent, HostComponent>) {
    const location: Location = TestBed.get(Location);
    const errorService: ErrorService = TestBed.get(ErrorService);
    expect(location.replaceState).not.toHaveBeenCalled();
    errorService.updateFailedRoute('');
    expect(location.replaceState).not.toHaveBeenCalled();
  });

});
