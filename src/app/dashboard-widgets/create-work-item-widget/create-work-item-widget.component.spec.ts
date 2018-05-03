import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';
import { WorkItem, WorkItemService } from 'fabric8-planner';
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

@Component({
  template: '<fabric8-create-work-item-widget></fabric8-create-work-item-widget>'
})
class HostComponent { }

describe('CreateWorkItemWidgetComponent', () => {
  type TestingContext = TestContext<CreateWorkItemWidgetComponent, HostComponent>;

  let fakeUser: Observable<User> = Observable.of({
    id: 'fakeId',
    type: 'fakeType',
    attributes: {
      fullName: 'fakeName',
      imageURL: 'null',
      username: 'fakeUserName'
    }
  } as User);

  initContext(CreateWorkItemWidgetComponent, HostComponent, {
    imports: [NgArrayPipesModule, HttpModule, RouterModule],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: new Subject<Context>() }) },
      {
        provide: UserService, useFactory: () => {
          let userService = createMock(UserService);
          userService.getUser.and.returnValue(fakeUser);
          userService.loggedInUser = fakeUser.publish() as ConnectableObservable<User> & jasmine.Spy;
          return userService;
        }
      },
      {
        provide: WorkItemService, useFactory: () => {
          let workItemServiceMock = jasmine.createSpyObj('WorkItemService', ['buildUserIdMap', 'getWorkItems']);
          workItemServiceMock.buildUserIdMap.and.returnValue(fakeUser);
          workItemServiceMock.getWorkItems.and.returnValue([] as WorkItem[]);

          return workItemServiceMock;
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

  it('should enable buttons if the user owns the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = true;
    this.testedDirective.myWorkItemsCount = Observable.of(0);
    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).not.toBeNull();
    expect(this.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).not.toBeNull();

  });

  it('should disable buttons if the user does not own the space', function(this: TestingContext) {
    this.testedDirective.userOwnsSpace = false;
    this.testedDirective.myWorkItemsCount = Observable.of(0);
    this.detectChanges();

    expect(this.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).toBeNull();
    expect(this.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).toBeNull();
  });
});
