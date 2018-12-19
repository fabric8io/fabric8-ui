import { Location } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Notifications } from 'ngx-base';
import { Context } from 'ngx-fabric8-wit';
import { Profile, UserService } from 'ngx-login-client';
import { BehaviorSubject } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext } from 'testing/test-context';
import { ContextService } from '../../shared/context.service';
import { OverviewComponent } from './overview.component';

@Component({
  selector: 'alm-work-items',
  template: '',
})
class MockWorkItemsComponent {}

@Component({
  selector: 'alm-spaces',
  template: '',
})
class MockSpacesComponent {}

@Component({
  template: '',
})
class MockComponent {}

@Component({
  template: '<alm-overview></alm-overview>',
})
class HostComponent {}

describe('OverviewComponent', (): void => {
  const testContext = initContext(OverviewComponent, HostComponent, {
    imports: [
      RouterTestingModule.withRoutes([
        {
          path: '',
          component: OverviewComponent,
          children: [
            {
              path: '',
              redirectTo: '_workitems',
              pathMatch: 'full',
            },
            {
              path: '_workitems',
              component: MockWorkItemsComponent,
              pathMatch: 'full',
            },
            {
              path: '_spaces',
              component: MockSpacesComponent,
              pathMatch: 'full',
            },
          ],
        },
        {
          path: ':username',
          component: MockComponent,
          children: [
            {
              path: '_update',
              component: MockComponent,
            },
          ],
        },
      ]),
    ],
    declarations: [OverviewComponent, MockWorkItemsComponent, MockSpacesComponent, MockComponent],
    providers: [
      {
        provide: UserService,
        useFactory: (): jasmine.SpyObj<UserService> => createMock(UserService),
      },
      {
        provide: Notifications,
        useFactory: (): jasmine.SpyObj<Notifications> => {
          const mock: jasmine.SpyObj<Notifications> = createMock(Notifications);
          mock.message.and.stub();
          return mock;
        },
      },
      {
        provide: ContextService,
        useFactory: (): jasmine.SpyObj<ContextService> => {
          const mock: jasmine.SpyObj<ContextService> = createMock(ContextService);
          mock.viewingOwnContext.and.returnValue(true);
          (mock as any).current = new BehaviorSubject<Context>({
            user: { attributes: { username: 'mock-username' } },
          } as Context);
          return mock;
        },
      },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  it('should set the user value to be userService.currentLoggedInUser.attributes', (): void => {
    expect(testContext.testedDirective.user.attributes).toEqual({
      username: 'mock-username',
    } as Profile);
  });

  describe(`when viewing another user's account`, (): void => {
    it('should update user', (): void => {
      expect(testContext.testedDirective.viewingOwnAccount).toBeTruthy();
      expect(testContext.testedDirective.user.attributes).toEqual({
        username: 'mock-username',
      } as Profile);

      TestBed.get(ContextService).viewingOwnContext.and.returnValue(false);
      TestBed.get(ContextService).current.next({
        user: { attributes: { username: 'some-other-user' } },
      });

      expect(testContext.testedDirective.viewingOwnAccount).toBeFalsy();
      expect(testContext.testedDirective.user.attributes).toEqual({
        username: 'some-other-user',
      } as Profile);
    });
  });

  describe('when logged user attributes are unavailable', (): void => {
    beforeEach(
      (): void => {
        TestBed.get(ContextService).viewingOwnContext.and.returnValue(true);
        TestBed.get(ContextService).current.next({ user: {} });
      },
    );

    it('should not update user', (): void => {
      expect(testContext.testedDirective.viewingOwnAccount).toBeTruthy();
      expect(testContext.testedDirective.user.attributes).toEqual({
        username: 'mock-username',
      } as Profile);
    });
  });

  describe('#routeToUpdateProfile()', () => {
    it('should route to the _update page for the given user', fakeAsync((): void => {
      const locationSpy: Location = TestBed.get(Location);
      testContext.testedDirective.routeToUpdateProfile();
      tick();
      expect(locationSpy.path()).toEqual('/mock-username/_update');
    }));
  });
});
