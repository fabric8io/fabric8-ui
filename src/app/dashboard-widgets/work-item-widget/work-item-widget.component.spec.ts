import { LocationStrategy } from '@angular/common';
import { DebugElement, DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Event, Router, RouterModule } from '@angular/router';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { cloneDeep } from 'lodash';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { Observable, Subject } from 'rxjs';

import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { SpacesService } from '../../shared/spaces.service';
import { WorkItemBarchartModule } from './work-item-barchart/work-item-barchart.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

describe('WorkItemWidgetComponent', () => {
  let fixture: ComponentFixture<WorkItemWidgetComponent>;
  let component: DebugNode['componentInstance'];

  let mockContext: Context;
  let workItem: WorkItem;
  let workItems: WorkItem[];
  let workItem1: WorkItem;
  let workItem2: WorkItem;
  let workItem3: WorkItem;
  let workItem4: WorkItem;
  let workItem5: WorkItem;

  const mockRouterEvent: Event = {
    'id': 1,
    'url': 'mock-url'
  } as Event;

  const mockFeature: Feature = {
    'attributes': {
      'name': 'mock-attribute',
      'enabled': true,
      'user-enabled': true
    }
  } as Feature;

  beforeEach(() => {

    mockContext = {
      'user': {
        'attributes': {
          'username': 'mock-username'
        },
        'id': 'mock-user'
      },
      'path': 'mock-path'
    } as Context;

    workItem = {
      attributes: {
        description: 'description',
        name: 'name'
      },
      type: 'workitems'
    } as WorkItem;

    let mockSpacesService: any = jasmine.createSpyObj('SpacesService', ['addRecent', 'current']);
    let mockSubject: any = jasmine.createSpy('Subject');

    workItem1 = cloneDeep(workItem);
    workItem1.attributes['system.state'] = 'open';
    workItem2 = cloneDeep(workItem);
    workItem2.attributes['system.state'] = 'open';
    workItem3 = cloneDeep(workItem);
    workItem3.attributes['system.state'] = 'in progress';
    workItem4 = cloneDeep(workItem);
    workItem4.attributes['system.state'] = 'resolved';
    workItem5 = cloneDeep(workItem);
    workItem5.attributes['system.state'] = 'new';
    workItems = [workItem1, workItem2, workItem3, workItem4, workItem5];

    mockSpacesService.addRecent.and.returnValue(mockSubject);
    mockSpacesService.addRecent.next = {};
    mockSpacesService = {
      ...mockSpacesService,
      ...{current: Observable.of({})}
    };

    TestBed.configureTestingModule({
      imports: [
        LoadingWidgetModule,
        RouterModule,
        WorkItemBarchartModule
      ],
      declarations: [
        MockFeatureToggleComponent,
        WorkItemWidgetComponent
      ],
      providers: [
        {
          provide: FeatureTogglesService,
          useFactory: () => {
            const mockFeatureTogglesService: jasmine.SpyObj<FeatureTogglesService> = createMock(FeatureTogglesService);
            mockFeatureTogglesService.getFeature.and.returnValue(Observable.of(mockFeature));
            return mockFeatureTogglesService;
          }
        },
        {
          provide: ActivatedRoute,
          useFactory: () => {
            const mockActivatedRoute: any = jasmine.createSpy('ActivatedRoute');
            return mockActivatedRoute;
          }
        },
        {
          provide: Contexts,
          useFactory: () => {
            const mockContexts: any = createMock(Contexts);
            mockContexts.current = Observable.of(mockContext);
            return mockContexts;
          }
        },
        {
          provide: LocationStrategy,
          useFactory: () => {
            const mockLocationStrategy: jasmine.SpyObj<LocationStrategy> = jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']);
            return mockLocationStrategy;
          }
        },
        {
          provide: Router,
          useFactory: () => {
            const mockRouter: any = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
            mockRouter.events = Observable.of(mockRouterEvent);
            return mockRouter;
          }
        },
        { provide: SpacesService, useValue: mockSpacesService },
        {
          provide: WorkItemService,
          useFactory: () => {
            const mockWorkItemService: jasmine.SpyObj<WorkItemService> = createMock(WorkItemService);
            mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
              workItems: workItems
            }));
            return mockWorkItemService;
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(WorkItemWidgetComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('Should output open count', () => {
    let element: DebugElement = fixture.debugElement.query(By.css('#open'));
    expect(element.nativeElement.textContent.trim().slice(0, '2'.length)).toBe('2');
  });

  it('Should output resolved count', () => {
    let element: DebugElement = fixture.debugElement.query(By.css('#resolved'));
    expect(element.nativeElement.textContent.trim().slice(0, '2'.length)).toBe('1');
  });

  it('Should output in progress count', () => {
    let element: DebugElement = fixture.debugElement.query(By.css('#in-progress'));
    expect(element.nativeElement.textContent.trim().slice(0, '1'.length)).toBe('1');
  });

  it('Should output total count', () => {
    let element: DebugElement = fixture.debugElement.query(By.css('#total'));
    expect(element.nativeElement.textContent.trim().slice(0, '5'.length)).toBe('5');
  });

  it('Should output a bar chart', () => {
    let elements: DebugElement[] = fixture.debugElement.queryAll(By.css('fabric8-work-item-barchart div'));
    expect(elements.length).toBe(1);
  });

  it('should enable buttons if the user owns the space', () => {
    component.userOwnsSpace = true;
    component.myWorkItemsCount = Observable.of(0);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#spacehome-workitems-create-button'))).not.toBeNull();
  });

  it('should disable buttons if the user does not own the space', () => {
    component.userOwnsSpace = false;
    component.myWorkItemsCount = Observable.of(0);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#spacehome-workitems-create-button'))).toBeNull();
  });

  describe('#updateWorkItems', () => {

    afterEach(() => {
      // ensure the component is not left in a loading state
      expect(component.loading).toEqual(false);
    });

    it('should not detailed work item counters for work items without a system.state', () => {
      const mockWorkItemService: jasmine.SpyObj<WorkItemService> = TestBed.get(WorkItemService);
      mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
        workItems: [workItem] // workItem has no system.state attribute
      }));

      fixture = TestBed.createComponent(WorkItemWidgetComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      // verify the work item was counted, but not towards specific counters
      expect(component.myWorkItemsCount).toEqual(1);
      expect(component.myWorkItemsOpen).toEqual(0);
      expect(component.myWorkItemsInProgress).toEqual(0);
      expect(component.myWorkItemsResolved).toEqual(0);
    });

    it('should reset the work item counters when a new context is encountered', () => {
      const mockWorkItemService: jasmine.SpyObj<WorkItemService> = TestBed.get(WorkItemService);
      const mockContexts: any = TestBed.get(Contexts);
      mockContexts.current = new Subject();

      fixture = TestBed.createComponent(WorkItemWidgetComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      mockContexts.current.next(mockContext);
      // verify that the work item counters have been incremented
      expect(component.myWorkItemsCount).toBeGreaterThan(0);
      expect(component.myWorkItemsOpen).toBeGreaterThan(0);
      expect(component.myWorkItemsInProgress).toBeGreaterThan(0);
      expect(component.myWorkItemsResolved).toBeGreaterThan(0);

      mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
        workItems: []
      }));
      mockContexts.current.next(mockContext);
      // if WI service returns empty list, counter variables should not increment after reset
      expect(component.myWorkItemsCount).toEqual(0);
      expect(component.myWorkItemsOpen).toEqual(0);
      expect(component.myWorkItemsInProgress).toEqual(0);
      expect(component.myWorkItemsResolved).toEqual(0);
    });

    it('should re-init the chart data when a new context is encountered', () => {
      const mockWorkItemService: jasmine.SpyObj<WorkItemService> = TestBed.get(WorkItemService);
      const mockContexts: any = TestBed.get(Contexts);
      mockContexts.current = new Subject();

      fixture = TestBed.createComponent(WorkItemWidgetComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      mockContexts.current.next(mockContext);
      // verify that chartData has been updated
      expect(component.chartData.yData[0]).toEqual([component.LABEL_RESOLVED, 1]);
      expect(component.chartData.yData[1]).toEqual([component.LABEL_IN_PROGRESS, 1]);
      expect(component.chartData.yData[2]).toEqual([component.LABEL_OPEN, 2]);

      mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
        workItems: [workItem1, workItem2, workItem3]
      }));
      mockContexts.current.next(mockContext);
      // verify that chartData contains the 3 workItems worth of information
      expect(component.chartData.yData[0]).toEqual([component.LABEL_RESOLVED, 0]);
      expect(component.chartData.yData[1]).toEqual([component.LABEL_IN_PROGRESS, 1]);
      expect(component.chartData.yData[2]).toEqual([component.LABEL_OPEN, 2]);
    });

    it('should increment the work item type counters accordingly', () => {
      let expectedCount: number = workItems.length;
      let expectedOpen: number = 0;
      let expectedInProgress: number = 0;
      let expectedResolved: number = 0;
      workItems.forEach(w => {
        switch (w.attributes['system.state']) {
          case 'open':
            expectedOpen++;
            break;
          case 'in progress':
            expectedInProgress++;
            break;
          case 'resolved':
            expectedResolved++;
            break;
        }
      });
      expect(expectedCount).toEqual(component.myWorkItemsCount);
      expect(expectedOpen).toEqual(component.myWorkItemsOpen);
      expect(expectedInProgress).toEqual(component.myWorkItemsInProgress);
      expect(expectedResolved).toEqual(component.myWorkItemsResolved);
    });
  });

  describe('#get myWorkItems', () => {
    it('should return an observable containing all retreived work items', () => {
      component.myWorkItems.subscribe((w: WorkItem[]) => {
        expect(w).toEqual(workItems);
      });
    });
  });

});
