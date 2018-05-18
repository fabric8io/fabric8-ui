import { AnalyzeOverviewComponent } from './analyze-overview.component';

import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Subscription } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { WorkItemBarchartModule } from '../../../dashboard-widgets/work-item-widget/work-item-barchart/work-item-barchart.module';
import { FeatureFlagModule } from '../../../feature-flag/feature-flag.module';
import { Feature, FeatureTogglesService } from '../../../feature-flag/service/feature-toggles.service';

@Component({
  template: '<alm-analyzeOverview></alm-analyzeOverview>'
})
class HostComponent { }

describe('AnalyzeOverviewComponent', () => {
  type TestingContext = TestContext<AnalyzeOverviewComponent, HostComponent>;

  let modalService: jasmine.SpyObj<BsModalService>;
  let broadcaster: jasmine.SpyObj<Broadcaster>;
  let authentication: jasmine.SpyObj<AuthenticationService>;
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

  initContext(AnalyzeOverviewComponent, HostComponent, {
    imports: [
      FeatureFlagModule
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
    spyOn(this.testedDirective, 'userOwnsSpace');

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
    expect(this.testedDirective.userOwnsSpace).toHaveBeenCalled();
  });

  it('should disable the button if user service unavailable', function(this: TestingContext) {
    fakeUserObs.next(null as User);
    this.detectChanges();

    expect(this.testedDirective.userOwnsSpace()).toBe(false);
  });

  it('should disable the button if context service unavailable', function(this: TestingContext) {
    this.detectChanges();
    expect(this.testedDirective.userOwnsSpace()).toBe(false);
  });

  it('should disable the button if both services are unavailable', function(this: TestingContext) {
    fakeUserObs.next(null as User);
    this.detectChanges();

    expect(this.testedDirective.userOwnsSpace()).toBe(false);
  });

  it('should recognize that the user owns the space', function(this: TestingContext) {
    const userService: jasmine.SpyObj<UserService> = TestBed.get(UserService);

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

    expect(this.testedDirective.userOwnsSpace()).toBe(true);
  });


  it('should recognize that the user does not own the space', function(this: TestingContext) {
    const userService: jasmine.SpyObj<UserService> = TestBed.get(UserService);

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

    expect(this.testedDirective.userOwnsSpace()).toBe(false);
  });
});
