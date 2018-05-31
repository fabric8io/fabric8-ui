import { PipelinesWidgetComponent } from './pipelines-widget.component';

import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { BuildConfig } from '../../../a-runtime-console/index';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  template: '<fabric8-pipelines-widget></fabric8-pipelines-widget>'
})
class HostComponent { }

describe('PipelinesWidgetComponent', () => {
  type TestingContext = TestContext<PipelinesWidgetComponent, HostComponent>;

  let ctxSubj: Subject<Context> = new Subject<Context>();
  let fakeUserObs: Subject<User> = new Subject<User>();

  initContext(PipelinesWidgetComponent, HostComponent, {
    imports: [HttpModule, LoadingWidgetModule, RouterModule],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: ctxSubj }) },
      { provide: UserService, useValue: ({ loggedInUser: fakeUserObs }) },
      {
        provide: PipelinesService, useFactory: () => {
          let pipelinesService: jasmine.SpyObj<PipelinesService> = createMock(PipelinesService);
          pipelinesService.getCurrentPipelines.and.returnValue(Observable.of([{}] as BuildConfig[]));
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
          mockRouter.events = Observable.of(mockRouterEvent);

          return mockRouter;
        }
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('should enable button if the user owns the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = true;
    this.testedDirective.loading = false;
    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#spacehome-pipelines-add-button'))).not.toBeNull();
  });

  it('should disable button if the user does not own the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = false;
    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#spacehome-pipelines-add-button'))).toBeNull();
  });

  it('should not show the add button if the user does not own the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = false;
    this.detectChanges();
    expect(this.fixture.debugElement.query(By.css('#pipelines-add-to-space-icon'))).toBeNull();
  });

  it('should show the add button if the user owns the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = true;
    this.testedDirective.loading = false;
    this.detectChanges();
    expect(this.fixture.debugElement.query(By.css('#pipelines-add-to-space-icon'))).not.toBeNull();
  });
});
