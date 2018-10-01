import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Observable,  of as observableOf, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { BuildConfig } from '../../../a-runtime-console/index';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';
import { PipelinesWidgetComponent } from './pipelines-widget.component';

@Component({
  template: '<fabric8-pipelines-widget></fabric8-pipelines-widget>'
})
class HostComponent { }

describe('PipelinesWidgetComponent', () => {
  type TestingContext = TestContext<PipelinesWidgetComponent, HostComponent>;

  let ctxSubj: Subject<Context> = new Subject<Context>();
  let fakeUserObs: Subject<User> = new Subject<User>();

  const testContext = initContext(PipelinesWidgetComponent, HostComponent, {
    imports: [LoadingWidgetModule, RouterModule],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: ctxSubj }) },
      { provide: UserService, useValue: ({ loggedInUser: fakeUserObs }) },
      {
        provide: PipelinesService, useFactory: () => {
          let pipelinesService: jasmine.SpyObj<PipelinesService> = createMock(PipelinesService);
          pipelinesService.getCurrentPipelines.and.returnValue(observableOf([{}] as BuildConfig[]));
          return pipelinesService;
        }
      },
      {
        provide: AuthenticationService, useFactory: (): jasmine.SpyObj<AuthenticationService> => {
          let authentication: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
          authentication.isLoggedIn.and.returnValue(true);
          return authentication;
        }
      },
      {
        provide: Router, useFactory: (): jasmine.SpyObj<Router> => {
          let mockRouterEvent: any = {
            'id': 1,
            'url': 'mock-url'
          };

          let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
          mockRouter.events = observableOf(mockRouterEvent);

          return mockRouter;
        }
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('should enable button if the user owns the space', function() {
    testContext.testedDirective.userOwnsSpace = true;
    testContext.testedDirective.loading = false;
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#spacehome-pipelines-add-button'))).not.toBeNull();
  });

  it('should disable button if the user does not own the space', function() {
    testContext.testedDirective.userOwnsSpace = false;
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#spacehome-pipelines-add-button'))).toBeNull();
  });

  it('should not show the add button if the user does not own the space', function() {
    testContext.testedDirective.userOwnsSpace = false;
    testContext.detectChanges();
    expect(testContext.fixture.debugElement.query(By.css('#pipelines-add-to-space-icon'))).toBeNull();
  });

  it('should show the add button if the user owns the space', function() {
    testContext.testedDirective.userOwnsSpace = true;
    testContext.testedDirective.loading = false;
    testContext.detectChanges();
    expect(testContext.fixture.debugElement.query(By.css('#pipelines-add-to-space-icon'))).not.toBeNull();
  });
});
