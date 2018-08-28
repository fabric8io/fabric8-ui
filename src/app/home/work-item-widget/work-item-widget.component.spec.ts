import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';

import { ConnectableObservable } from 'rxjs';
import { Observable, Subject } from 'rxjs';

import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Fabric8WitModule, Spaces } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { cloneDeep } from 'lodash';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { spaceMock } from '../../shared/context.service.mock';
import { WorkItemWidgetComponent } from './work-item-widget.component';

@Component({
  template: '<alm-work-item-widget></alm-work-item-widget>'
})
class HostComponent {}

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

  let fakeWorkItem1 = cloneDeep(fakeWorkItem);
  let fakeWorkItem2 = cloneDeep(fakeWorkItem);
  let fakeWorkItem3 = cloneDeep(fakeWorkItem);
  let fakeWorkItem4 = cloneDeep(fakeWorkItem);
  let fakeWorkItem5 = cloneDeep(fakeWorkItem);

  fakeWorkItem1.attributes['system.state'] = 'open';
  fakeWorkItem2.attributes['system.state'] = 'open';
  fakeWorkItem2.relationalData = {parent: fakeWorkItem3};
  fakeWorkItem3.attributes['system.state'] = 'in progress';
  fakeWorkItem4.attributes['system.state'] = 'resolved';
  fakeWorkItem5.attributes['system.state'] = 'new';

  let fakeWorkItems: WorkItem[] = [fakeWorkItem1, fakeWorkItem2, fakeWorkItem3, fakeWorkItem4, fakeWorkItem5];

  let fakeWorkItemsObs: Observable<{workItems: WorkItem[]}> = Observable.of({
    workItems: fakeWorkItems
  });

  initContext(WorkItemWidgetComponent, HostComponent, {
    declarations: [ MockFeatureToggleComponent ],
    imports: [
      Fabric8WitModule,
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
          let workItemServiceMock = createMock(WorkItemService);

          workItemServiceMock.buildUserIdMap.and.stub();
          workItemServiceMock.resolveType.and.stub();
          workItemServiceMock.resolveAreaForWorkItem.and.stub();
          workItemServiceMock.resolveCreator.and.stub();
          workItemServiceMock.getWorkItems.and.returnValue(fakeWorkItemsObs);

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
      }, {
        provide: FilterService, useFactory: () => {
          let filterServiceMock = jasmine.createSpyObj('FilterService', ['queryBuilder', 'queryJoiner']);
          return filterServiceMock;
        }
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('Should show blank state if there are no workitems', function(this: TestingContext) {
    this.testedDirective.workItems.length = 0;
    this.detectChanges();
    expect(this.fixture.debugElement.query(By.css('.f8-blank-slate-card'))).not.toBeNull();
  });

  it('Should have logged in user', function(this: TestingContext) {
    expect(this.testedDirective.loggedInUser).not.toBeNull();
  });

  it('Should have recent space', function(this: TestingContext) {
    expect(this.testedDirective.recentSpaces.length).toBe(1);
    expect(this.testedDirective.recentSpaces[0].name).toBe('space1');
  });

  it('Should have select element', function(this: TestingContext) {
    let select = this.fixture.debugElement.query(By.css('.work-item-combobox'));
    expect(select).not.toBeNull();
  });

  it('Should have select element options', function(this: TestingContext) {
    let options = this.fixture.debugElement.queryAll(By.css('.work-item-combobox option'));
    expect(options.length).toBe(2);
  });

  it('should have set the index after sifting through spaces', function(this: TestingContext) {
    expect(this.testedDirective.recentSpaceIndex).toBe(-1);
  });

  it('should set relational data to an empty obj if it does not exist prior', function(this: TestingContext) {
    expect(fakeWorkItem1.relationalData).toBeDefined();
    expect(fakeWorkItem1.relationalData).toEqual({});
  });

  it('should not overwrite pre-existing relational data', function(this: TestingContext) {
    expect(fakeWorkItem2.relationalData).toEqual({parent: fakeWorkItem3});
  });

  describe('#fetchWorkItems', () => {

    it('should fetch the correct work items', function(this: TestingContext) {
      this.testedDirective.workItems.length = 0;
      this.testedDirective.fetchWorkItems();
      expect(this.testedDirective.workItems).toEqual(fakeWorkItems);
    });

    it('should update the recentSpaceIndex when it filters through all the work items', function(this: TestingContext) {
      this.testedDirective.workItems.length = 0;
      this.testedDirective.fetchWorkItems();
      expect(this.testedDirective.recentSpaceIndex).toBe(-1);
    });

    it('should not fetch closed workitems', function(this: TestingContext) {
      fakeWorkItem1.attributes['system.state'] = 'closed';
      this.testedDirective.fetchWorkItems();
      expect(this.testedDirective.workItems).toEqual(fakeWorkItems.slice(1));
    });
  });
});
