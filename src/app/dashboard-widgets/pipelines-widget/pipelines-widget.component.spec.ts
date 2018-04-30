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
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';

@Component({
  template: '<fabric8-pipelines-widget></fabric8-pipelines-widget>'
})
class HostComponent { }

describe('PipelinesWidgetComponent', () => {
  type TestingContext = TestContext<PipelinesWidgetComponent, HostComponent>;

  let modalService: jasmine.SpyObj<BsModalService>;
  let broadcaster: jasmine.SpyObj<Broadcaster>;
  let pipelinesService: jasmine.SpyObj<PipelinesService>;
  let authentication: jasmine.SpyObj<AuthenticationService>;
  let ctxSubj: Subject<Context> = new Subject();

  let mockRouter;
  let mockActivatedRoute;
  let mockLocationStrategy;

  let fakeUserObs: Subject<User> = new Subject<User>();

  let mockRouterEvent: any = {
    'id': 1,
    'url': 'mock-url'
  };

  initContext(PipelinesWidgetComponent, HostComponent, {
    imports: [HttpModule, RouterModule],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: ctxSubj }) },
      {
        provide: PipelinesService, useFactory: () => {
          pipelinesService = createMock(PipelinesService);
          pipelinesService.getCurrentPipelines.and.returnValue(Observable.of([{}] as BuildConfig[]));
          return pipelinesService;
        }
      },
      {
        provide: AuthenticationService, useFactory: (): jasmine.SpyObj<AuthenticationService> => {
          authentication = createMock(AuthenticationService);
          authentication.isLoggedIn.and.returnValue(true);
          return authentication;
        }
      },
      {
        provide: UserService, useValue: ({ loggedInUser: fakeUserObs })
      },
      {
        provide: Router, useFactory: (): jasmine.SpyObj<Router> => {
          mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
          mockRouter.events = Observable.of(mockRouterEvent);

          return mockRouter;
        }
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
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
