import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { NotificationsService } from 'app/shared/notifications.service';
import { Environment } from '../models/environment';
import { PodPhase } from '../models/pod-phase';
import { Pods } from '../models/pods';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentsDonutComponent } from './deployments-donut.component';

@Component({
  template: '<deployments-donut></deployments-donut>'
})
class HostComponent { }

@Component({
  selector: 'deployments-donut-chart',
  template: ''
})
class FakeDeploymentsDonutChartComponent {
  @Input() desiredReplicas: number;
  @Input() idled: boolean;
  @Input() mini: boolean;
  @Input() pods: any[];
  @Input() colors: any;
}

describe('DeploymentsDonutComponent', () => {
  type Context = TestContext<DeploymentsDonutComponent, HostComponent>;

  let notifications: jasmine.SpyObj<NotificationsService> =
    jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  beforeEach(fakeAsync(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.scalePods.and.returnValue(
      Observable.of('scalePods')
    );
    mockSvc.getPods.and.returnValue(
      Observable.of({ pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]], total: 2 })
    );
  }));

  initContext(DeploymentsDonutComponent, HostComponent,
    {
      declarations: [FakeDeploymentsDonutChartComponent],
      providers: [
        { provide: DeploymentsService, useFactory: () => mockSvc },
        { provide: NotificationsService, useValue: notifications }
      ]
    },
    (component: DeploymentsDonutComponent) => {
      component.mini = false;
      component.spaceId = 'space';
      component.applicationId = 'application';
      component.environment = { name: 'environmentName' } as Environment;
    });

  it('should use pods data for initial desired replicas', function(this: Context) {
    expect(this.testedDirective.desiredReplicas).toEqual(2);
  });

  it('should increment desired replicas on scale up by one', function(this: Context) {
    let desired: number = 2;
    expect(this.testedDirective.desiredReplicas).toBe(desired);

    this.testedDirective.scaleUp();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(desired + 1);
  });

  it('should decrement desired replicas on scale down by one', function(this: Context) {
    let desired: number = 2;
    expect(this.testedDirective.desiredReplicas).toBe(desired);

    this.testedDirective.scaleDown();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', function(this: Context) {
    let desired: number = 2;
    expect(this.testedDirective.desiredReplicas).toBe(desired);

    this.testedDirective.scaleDown();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(desired - 1);

    this.testedDirective.scaleDown();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(0);

    this.testedDirective.scaleDown();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(0);
  });

  it('should acquire pods data', function(this: Context, done: DoneFn) {
    this.testedDirective.pods.subscribe((pods: Pods) => {
      expect(pods).toEqual({
        pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]],
        total: 2
      });
      done();
    });
  });

  it('should call scalePods when scaling up', function(this: Context) {
    let de: DebugElement = this.fixture.debugElement.query(By.css('#scaleUp'));
    let el: any = de.nativeElement;

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
  });

  it('should call scalePods when scaling down', function(this: Context) {
    let de: DebugElement = this.fixture.debugElement.query(By.css('#scaleDown'));
    let el: any = de.nativeElement;

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);
  });

  it('should not call scalePods when scaling below 0', function(this: Context) {
    let de: DebugElement = this.fixture.debugElement.query(By.css('#scaleDown'));
    let el: any = de.nativeElement;

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 0);

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledTimes(2);
  });

  it('should not call notifications when scaling successfully', function(this: Context) {
    this.testedDirective.scaleUp();
    this.detectChanges();
    this.testedDirective.debounceScale.flush();

    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
    expect(notifications.message).not.toHaveBeenCalled();
  });
});

describe('DeploymentsDonutComponent error handling', () => {
  type Context = TestContext<DeploymentsDonutComponent, HostComponent>;

  let notifications: jasmine.SpyObj<NotificationsService> =
    jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  beforeEach(fakeAsync(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.scalePods.and.returnValue(
      Observable.throw('scalePods error')
    );
    mockSvc.getPods.and.returnValue(
      Observable.of({ pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]], total: 2 })
    );
  }));

  initContext(DeploymentsDonutComponent, HostComponent,
    {
      declarations: [FakeDeploymentsDonutChartComponent],
      providers: [
        { provide: DeploymentsService, useFactory: () => mockSvc },
        { provide: NotificationsService, useValue: notifications }
      ]
    },
    (component: DeploymentsDonutComponent) => {
      component.mini = false;
      component.spaceId = 'space';
      component.applicationId = 'application';
      component.environment = { name: 'environmentName' } as Environment;
    });


  it('should notify if scaling pods has an error', function(this: Context) {
    this.testedDirective.scaleUp();
    this.detectChanges();
    this.testedDirective.debounceScale.flush();

    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
    expect(notifications.message).toHaveBeenCalled();
  });
});
