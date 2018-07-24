import { AnalyzeOverviewComponent } from './analyze-overview.component';

import {
  Component,
  NO_ERRORS_SCHEMA,
  OnInit
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { Observable, Subject } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { AuthenticationService, User, UserService } from 'ngx-login-client';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

let callCount: number = 0;
@Component({
  selector: 'fabric8-analytical-report-widget',
  template: '<div></div>'
})
class FakeAnalyticalReportWidget implements OnInit {
  ngOnInit() {
    callCount++;
  }
}

@Component({
  template: '<alm-analyzeOverview></alm-analyzeOverview>'
})
class HostComponent { }

describe('AnalyzeOverviewComponent', () => {
  type TestingContext = TestContext<AnalyzeOverviewComponent, HostComponent>;

  let ctxSubj: Subject<Context> = new Subject<Context>();
  let fakeUserObs: Subject<User> = new Subject<User>();

  let mockFeatureTogglesService = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);
  let mockFeature: Feature = {
    'attributes': {
      'name': 'mock-attribute',
      'enabled': true,
      'user-enabled': true
    }
  };
  mockFeatureTogglesService.getFeature.and.returnValue(Observable.of(mockFeature));

  beforeEach(() => {
    callCount = 0;
  });

  initContext(AnalyzeOverviewComponent, HostComponent, {
    declarations: [
      FakeAnalyticalReportWidget
    ],
    providers: [
      { provide: BsModalService, useFactory: (): jasmine.SpyObj<BsModalService> => createMock(BsModalService) },
      { provide: Broadcaster, useFactory: (): jasmine.SpyObj<Broadcaster> => createMock(Broadcaster) },
      { provide: AuthenticationService, useValue: ({ isLoggedIn: () => true }) },
      { provide: Contexts, useValue: ({ current: ctxSubj }) },
      { provide: FeatureTogglesService, useValue: mockFeatureTogglesService },
      { provide: UserService, useValue: ({ loggedInUser: fakeUserObs }) }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('should call to check the user space', function(this: TestingContext) {
    spyOn(this.testedDirective, 'checkSpaceOwner');

    fakeUserObs.next({
      id: 'loggedInUser'
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();
    expect(this.testedDirective.checkSpaceOwner).toHaveBeenCalled();
  });

  it('should disable the button if user service unavailable', function(this: TestingContext) {
    fakeUserObs.next(null as User);
    this.detectChanges();

    expect(this.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should disable the button if context service unavailable', function(this: TestingContext) {
    this.detectChanges();
    expect(this.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should disable the button if both services are unavailable', function(this: TestingContext) {
    fakeUserObs.next(null as User);
    this.detectChanges();

    expect(this.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should recognize that the user owns the space', function(this: TestingContext) {
    fakeUserObs.next({
      id: 'loggedInUser'
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();

    expect(this.testedDirective.checkSpaceOwner()).toBe(true);
  });

  it('should recognize that the user does not own the space', function(this: TestingContext) {
    fakeUserObs.next({
      id: 'loggedInUser'
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'someOtherUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();

    expect(this.testedDirective.checkSpaceOwner()).toBe(false);
  });

  it('should show the Create an Application button if the user owns the space', function(this: TestingContext) {
    fakeUserObs.next({
      id: 'loggedInUser'
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'loggedInUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#user-level-analyze-overview-dashboard-create-space-button'))).not.toBeNull();
  });

  it('should hide the Create an Application button if the user does not own the space', function(this: TestingContext) {
    fakeUserObs.next({
      id: 'loggedInUser'
    } as User);

    ctxSubj.next({
      space: {
        relationships: {
          'owned-by': {
            data: {
              id: 'someOtherUser'
            }
          }
        }
      } as Space
    } as Context);

    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#user-level-analyze-overview-dashboard-create-space-button'))).toBeNull();
  });

  it('should only instantiate visible feature flagged components', () => {
    // There are two instances of fabric8-analytical-report-widget in the html
    // under user and default feature level; it should only instantiate once.
    expect(callCount).toBe(1);
  });
});
