import { LocationStrategy } from '@angular/common';
import { DebugElement, DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Event, Router, RouterModule } from '@angular/router';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { cloneDeep } from 'lodash';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { Observable } from 'rxjs';

import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { WorkItemBarchartModule } from './work-item-barchart/work-item-barchart.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

describe('WorkItemWidgetComponent', () => {
  let fixture: ComponentFixture<WorkItemWidgetComponent>;
  let component: DebugNode['componentInstance'];

  let mockContext: Context;
  let workItem: WorkItem;

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

  let workItem1: WorkItem = cloneDeep(workItem);
  let workItem2: WorkItem = cloneDeep(workItem);
  let workItem3: WorkItem = cloneDeep(workItem);
  let workItem4: WorkItem = cloneDeep(workItem);
  let workItem5: WorkItem = cloneDeep(workItem);

  beforeEach(() => {

    mockContext = {
      'user': {
        'attributes': {
          'username': 'mock-username'
        },
        'id': 'mock-user'
      }
    } as Context;

    workItem = {
      attributes: {
        description: 'description',
        name: 'name'
      },
      type: 'workitems'
    } as WorkItem;

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
        {
          provide: WorkItemService,
          useFactory: () => {
            const mockWorkItemService: jasmine.SpyObj<WorkItemService> = createMock(WorkItemService);
            mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
              workItems: [workItem1, workItem2, workItem3, workItem4, workItem5]
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

});
