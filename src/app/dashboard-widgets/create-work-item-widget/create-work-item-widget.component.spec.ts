import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';
import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { NgLetModule } from 'fabric8-planner/app/shared/ng-let';
import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { WorkItemsData } from '../../shared/workitem-utils';
import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

@Component({
  template: `
    <fabric8-create-work-item-widget
      [userOwnsSpace]="userOwnsSpace"
      [currentSpace]="space"
      [loggedInUser]="loggedInUser">
    </fabric8-create-work-item-widget>
  `
})
class HostComponent {
  userOwnsSpace: boolean;
  space: Space = {
    attributes: {},
    id: 'some-space-id'
  } as Space;
  loggedInUser: User = {
    id: 'fakeId',
    type: 'fakeType',
    attributes: {
      fullName: 'fakeName',
      imageURL: 'null',
      username: 'fakeUserName'
    }
  };
}

describe('CreateWorkItemWidgetComponent', () => {
  describe('Should test without WorkItems', () => {

    type TestingContext = TestContext<CreateWorkItemWidgetComponent, HostComponent>;

    const testContext: TestingContext = initContext(CreateWorkItemWidgetComponent, HostComponent, {
      declarations: [ MockFeatureToggleComponent ],
      imports: [NgArrayPipesModule, RouterModule, NgLetModule],
      providers: [
        { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
        { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
        { provide: Broadcaster, useValue: createMock(Broadcaster) },
        { provide: Contexts, useValue: ({ current: new Subject<Context>() }) },
        {
          provide: WorkItemService, useFactory: () => {
            let workItemServiceMock = jasmine.createSpyObj('WorkItemService', ['resolveType', 'resolveAreaForWorkItem', 'getWorkItems']);
            workItemServiceMock.resolveType.and.stub();
            workItemServiceMock.resolveAreaForWorkItem.and.stub();
            workItemServiceMock.getWorkItems.and.returnValue(observableOf({ workItems: [] }) as Observable<WorkItemsData>);
            return workItemServiceMock;
          }
        },
        {
          provide: FilterService, useFactory: () => {
            let filterServiceMock: jasmine.SpyObj<FilterService> = jasmine.createSpyObj('FilterService', ['queryBuilder', 'queryJoiner']);
            return filterServiceMock;
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

    it('Should show blank state if there are no workitems', function() {
      testContext.testedDirective.myWorkItems = observableOf([]);
      testContext.detectChanges();
      expect(testContext.fixture.debugElement.query(By.css('.f8-blank-slate-card'))).not.toBeNull();
    });

    it('Should have logged in user', function() {
      expect(testContext.testedDirective.loggedInUser).not.toBeNull();
    });

    it('Should have current space', function() {
      expect(testContext.testedDirective.currentSpace).not.toBeNull();
    });

    it('should enable buttons if the user owns the space', function() {
      testContext.hostComponent.userOwnsSpace = true;
      testContext.detectChanges();
      expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).not.toBeNull();
      expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).not.toBeNull();

    });

    it('should disable buttons if the user does not own the space', function() {
      testContext.hostComponent.userOwnsSpace = false;
      testContext.detectChanges();

      expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).toBeNull();
      expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).toBeNull();
    });
  });

  describe('Should test with WorkItems', () => {
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

    fakeWorkItem1.attributes['system.state'] = 'open';
    fakeWorkItem2.attributes['system.state'] = 'open';

    let fakeWorkItems: WorkItem[] = [fakeWorkItem1, fakeWorkItem2];

    let fakeWorkItemsObs: Observable<WorkItemsData> = observableOf({
      workItems: fakeWorkItems
    } as WorkItemsData);

    type TestingContext = TestContext<CreateWorkItemWidgetComponent, HostComponent>;

    const testContext: TestingContext = initContext(CreateWorkItemWidgetComponent, HostComponent, {
      declarations: [ MockFeatureToggleComponent ],
      imports: [NgArrayPipesModule, RouterModule, NgLetModule],
      providers: [
        { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
        { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
        { provide: Broadcaster, useValue: createMock(Broadcaster) },
        { provide: Contexts, useValue: ({ current: new Subject<Context>() }) },
        {
          provide: WorkItemService, useFactory: () => {
            let workItemServiceMock = jasmine.createSpyObj('WorkItemService', ['resolveType', 'resolveAreaForWorkItem', 'getWorkItems']);
            workItemServiceMock.resolveType.and.stub();
            workItemServiceMock.resolveAreaForWorkItem.and.stub();
            workItemServiceMock.getWorkItems.and.returnValue(fakeWorkItemsObs as Observable<WorkItemsData>);
            return workItemServiceMock;
          }
        },
        {
          provide: FilterService, useFactory: () => {
            let filterServiceMock: jasmine.SpyObj<FilterService> = jasmine.createSpyObj('FilterService', ['queryBuilder', 'queryJoiner']);
            return filterServiceMock;
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

    it('should fetch the correct work items', async(function() {
      testContext.testedDirective.myWorkItems = observableOf([]);
      testContext.testedDirective.fetchWorkItems();
      testContext.testedDirective.myWorkItems.subscribe((workItems: WorkItem[]) => {
        expect(workItems).toEqual(fakeWorkItems);
      });
    }));
  });
});

