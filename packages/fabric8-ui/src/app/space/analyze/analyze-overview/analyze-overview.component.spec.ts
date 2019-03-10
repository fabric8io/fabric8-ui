import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService, PermissionService, User, UserService } from 'ngx-login-client';
import { of, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { initContext, TestContext } from 'testing/test-context';
import { AnalyzeOverviewComponent } from './analyze-overview.component';

@Component({
  template: '<alm-analyzeOverview></alm-analyzeOverview>',
})
class HostComponent {}

describe('AnalyzeOverviewComponent', () => {
  type TestingContext = TestContext<AnalyzeOverviewComponent, HostComponent>;

  const ctxSubj: Subject<Context> = new Subject<Context>();
  const fakeUserObs: Subject<User> = new Subject<User>();

  const testContext: TestingContext = initContext(AnalyzeOverviewComponent, HostComponent, {
    declarations: [MockFeatureToggleComponent],
    providers: [
      {
        provide: BsModalService,
        useFactory: (): jasmine.SpyObj<BsModalService> => createMock(BsModalService),
      },
      {
        provide: Broadcaster,
        useFactory: (): jasmine.SpyObj<Broadcaster> => createMock(Broadcaster),
      },
      { provide: AuthenticationService, useValue: { isLoggedIn: () => true } },
      { provide: Contexts, useValue: { current: ctxSubj } },
      { provide: PermissionService, useValue: { hasScope: () => of(false) } },
      { provide: UserService, useValue: { loggedInUser: fakeUserObs } },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  });

  it('should call to check the user space', () => {
    spyOn(testContext.testedDirective, 'checkSpaceOwner');

    fakeUserObs.next({
      id: 'loggedInUser',
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser',
            },
          },
        },
      } as Space,
    } as Context);

    testContext.detectChanges();
    expect(testContext.testedDirective.checkSpaceOwner).toHaveBeenCalled();
  });

  it('should disable the button if user service unavailable', () => {
    fakeUserObs.next(null as User);
    testContext.detectChanges();

    expect(testContext.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should disable the button if context service unavailable', () => {
    testContext.detectChanges();
    expect(testContext.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should disable the button if both services are unavailable', () => {
    fakeUserObs.next(null as User);
    testContext.detectChanges();

    expect(testContext.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should recognize that the user is not admin of the space', () => {
    testContext.detectChanges();
    expect(testContext.testedDirective.userIsSpaceAdmin).toBe(false);
  });

  it('should recognize that the user owns the space', () => {
    fakeUserObs.next({
      id: 'loggedInUser',
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser',
            },
          },
        },
      } as Space,
    } as Context);

    testContext.detectChanges();

    expect(testContext.testedDirective.checkSpaceOwner()).toBe(true);
  });

  it('should recognize that the user does not own the space', () => {
    fakeUserObs.next({
      id: 'loggedInUser',
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'someOtherUser',
            },
          },
        },
      } as Space,
    } as Context);

    testContext.detectChanges();

    expect(testContext.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should show the Create an Application button if the user owns the space', () => {
    fakeUserObs.next({
      id: 'loggedInUser',
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser',
            },
          },
        },
      } as Space,
    } as Context);

    testContext.detectChanges();
    const oldNavigation = testContext.fixture.debugElement.query(By.css('#old-navigation'));
    const applicationButton = testContext.fixture.debugElement.query(
      By.css('#user-level-analyze-overview-dashboard-create-space-button'),
    );
    if (oldNavigation) {
      expect(applicationButton).not.toBeNull();
    } else {
      expect(applicationButton).toBeNull();
    }
  });

  it('should hide the Create an Application button if the user does not own the space', () => {
    fakeUserObs.next({
      id: 'loggedInUser',
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'someOtherUser',
            },
          },
        },
      } as Space,
    } as Context);

    testContext.detectChanges();

    expect(
      testContext.fixture.debugElement.query(
        By.css('#user-level-analyze-overview-dashboard-create-space-button'),
      ),
    ).toBeNull();
  });
});
