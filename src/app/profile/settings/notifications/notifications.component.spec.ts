import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from 'ngx-login-client';
import { initContext } from 'testing/test-context';
import { NotificationsComponent } from './notifications.component';

@Component({
  template: '<alm-notifications></alm-notifications>'
})
class HostComponent { }

describe('NotificationsComponent', (): void => {

  describe('with user ID', (): void => {
    const testContext = initContext(NotificationsComponent, HostComponent, {
      providers: [
        {
          provide: UserService, useFactory: (): any => ({
            currentLoggedInUser: {
              id: '1234',
              attributes: {
                username: 'mock-username'
              }
            }
          })
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    it('should set loggedInUserName', (): void => {
      expect(testContext.testedDirective.loggedInUserName).toEqual('mock-username');
    });
  });

  describe('without user ID', (): void => {
    const testContext = initContext(NotificationsComponent, HostComponent, {
      providers: [
        {
          provide: UserService, useFactory: (): any => ({
            currentLoggedInUser: {
              attributes: {
                username: 'mock-username'
              }
            }
          })
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    it('should set loggedInUserName', (): void => {
      expect(testContext.testedDirective.loggedInUserName).toEqual('');
    });
  });

});
