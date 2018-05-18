import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';

import { ConnectableObservable } from 'rxjs';
import { Observable, Subject } from 'rxjs';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Fabric8WitModule, Spaces } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { spaceMock } from '../../shared/context.service.mock';
import { WorkItemWidgetComponent } from './work-item-widget.component';

@Component({
  template: '<alm-work-item-widget></alm-work-item-widget>'
})
class HostComponent {
  userOwnsSpace: boolean;
}

describe('WorkItemWidgetComponent', () => {
  type TestingContext = TestContext<WorkItemWidgetComponent, HostComponent>;

  let fakeUser: Observable<User> = Observable.of({
    id: 'fakeId',
    type: 'fakeType',
    attributes: {
      fullName: 'fakeName',
      imageURL: 'null',
      username: 'fakeUserName'
    }
  } as User);

  let fakeWorkItem: WorkItem = {
    attributes: {
      'system.number': 1,
      'system.state': 'new'
    },
    relationships: {
      baseType: {
        data: {
          id: '71171e90-6d35-498f-a6a7-2083b5267c18',
          type: 'workitemtypes'
        }
      }
    },
    type: 'workitems'
  };

  let fakeWorkItems: Observable<{workItems: WorkItem[]}> = Observable.of({
    workItems: [fakeWorkItem]
  });

  initContext(WorkItemWidgetComponent, HostComponent, {
    imports: [
      Fabric8WitModule,
      HttpModule,
      NgArrayPipesModule,
      RouterModule
    ],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: new Subject<Context>() }) },
      { provide: UserService, useFactory: () => {
          let userService = createMock(UserService);
          userService.getUser.and.returnValue(fakeUser);
          userService.loggedInUser = fakeUser.publish() as ConnectableObservable<User> & jasmine.Spy;
          return userService;
        }
      }, {
        provide: WorkItemService, useFactory: () => {
          let workItemServiceMock = jasmine.createSpyObj('WorkItemService', ['buildUserIdMap', 'getWorkItems']);
          workItemServiceMock.buildUserIdMap.and.returnValue(fakeUser);
          workItemServiceMock.getWorkItems.and.returnValue([] as WorkItem[]);
          return workItemServiceMock;
        }
      }, {
        provide: Router, useFactory: (): jasmine.SpyObj<Router> => {
          let mockRouterEvent: any = {
            'id': 1,
            'url': 'mock-url'
          };
          let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
          mockRouter.events = Observable.of(mockRouterEvent);
          return mockRouter;
        }
      }, {
        provide: Spaces, useValue: {
          'current': Observable.of(spaceMock),
          'recent': Observable.of([spaceMock])
        } as Spaces
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('Should show blank state', function(this: TestingContext) {
    expect(this.testedDirective.workItems.length).toBe(0);
    expect(this.fixture.debugElement.query(By.css('.f8-blank-slate-card'))).not.toBeNull();
  });

  it('Should have logged in user', function(this: TestingContext) {
    expect(this.testedDirective.loggedInUser).not.toBeNull();
  });

  it('Should have recent space', function(this: TestingContext) {
    expect(this.testedDirective.recentSpaces.length).toBe(1);
    expect(this.testedDirective.recentSpaces[0].name).toBe('space1');
    expect(this.testedDirective.recentSpaceIndex).toBe(0);
  });

  it('Should have select element', function(this: TestingContext) {
    let select = this.fixture.debugElement.query(By.css('.work-item-combobox'));
    expect(select).not.toBeNull();
  });

  it('Should have select element options', function(this: TestingContext) {
    let options = this.fixture.debugElement.queryAll(By.css('.work-item-combobox option'));
    expect(options.length).toBe(4);
  });
});
