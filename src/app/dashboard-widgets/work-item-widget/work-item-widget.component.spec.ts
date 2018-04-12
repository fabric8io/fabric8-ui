import { LocationStrategy } from '@angular/common';
import { DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { Contexts } from 'ngx-fabric8-wit';

import { WorkItemBarchartModule } from './work-item-barchart/work-item-barchart.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

describe('WorkItemWidgetComponent', () => {
  let fixture: ComponentFixture<WorkItemWidgetComponent>;
  let component: DebugNode['componentInstance'];

  let mockContext = {
    'user': {
      'attributes': {
        'username': 'mock-username'
      },
      'id': 'mock-user'
    }
  };
  let mockRouterEvent: any = {
    'id': 1,
    'url': 'mock-url'
  };
  let workItem = {
    attributes: {
      description: 'description',
      name: 'name'
    },
    type: 'workitems'
  } as WorkItem;

  let workItem1 = cloneDeep(workItem);
  let workItem2 = cloneDeep(workItem);
  let workItem3 = cloneDeep(workItem);
  let workItem4 = cloneDeep(workItem);
  let workItem5 = cloneDeep(workItem);

  let mockActivatedRoute: any = jasmine.createSpy('ActivatedRoute');
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockLocationStrategy: any = jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']);
  let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
  let mockWorkItemService: any = jasmine.createSpyObj('WorkItemService', ['getWorkItems']);

  beforeEach(() => {
    workItem1.attributes['system.state'] = 'open';
    workItem2.attributes['system.state'] = 'open';
    workItem3.attributes['system.state'] = 'in progress';
    workItem4.attributes['system.state'] = 'resolved';
    workItem5.attributes['system.state'] = 'new';

    mockContexts.current = Observable.of(mockContext);
    mockRouter.events = Observable.of(mockRouterEvent);
    mockWorkItemService.getWorkItems.and.returnValue(Observable.of({
      workItems: [workItem1, workItem2, workItem3, workItem4, workItem5]
    }));

    TestBed.configureTestingModule({
      imports: [
        WorkItemBarchartModule,
        RouterModule
      ],
      declarations: [WorkItemWidgetComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Contexts, useFactory: () => mockContexts },
        { provide: LocationStrategy, useValue: mockLocationStrategy },
        { provide: Router, useValue: mockRouter },
        { provide: WorkItemService, useValue: mockWorkItemService }
      ]
    });
    fixture = TestBed.createComponent(WorkItemWidgetComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('Should output open count', () => {
    let element = fixture.debugElement.query(By.css('#open'));
    expect(element.nativeElement.textContent.trim().slice(0, '2'.length)).toBe('2');
  });

  it('Should output resolved count', () => {
    let element = fixture.debugElement.query(By.css('#resolved'));
    expect(element.nativeElement.textContent.trim().slice(0, '2'.length)).toBe('1');
  });

  it('Should output in progress count', () => {
    let element = fixture.debugElement.query(By.css('#in-progress'));
    expect(element.nativeElement.textContent.trim().slice(0, '1'.length)).toBe('1');
  });

  it('Should output total count', () => {
    let element = fixture.debugElement.query(By.css('#total'));
    expect(element.nativeElement.textContent.trim().slice(0, '5'.length)).toBe('5');
  });

  it('Should output a bar chart', () => {
    let elements = fixture.debugElement.queryAll(By.css('fabric8-work-item-barchart div'));
    expect(elements.length).toBe(1);
  });
});
