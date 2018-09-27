import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  of,
  Subject,
  throwError as _throw
} from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
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

  const testContext = initContext(DeploymentsDonutComponent, HostComponent,
    {
      declarations: [FakeDeploymentsDonutChartComponent],
      providers: [
        {
          provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
            svc.scalePods.and.returnValue(
              of('scalePods')
            );
            svc.getPods.and.returnValue(
              of({ pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]], total: 2 })
            );
            svc.getEnvironmentCpuStat.and.returnValue(new Subject<CpuStat>());
            svc.getEnvironmentMemoryStat.and.returnValue(new Subject<MemoryStat>());
            return svc;
          }
        },
        { provide: NotificationsService, useValue: jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']) }
      ]
    },
    (component: DeploymentsDonutComponent) => {
      component.mini = false;
      component.spaceId = 'space';
      component.applicationId = 'application';
      component.environment = 'environmentName';
    });

  it('should get the pods with the correct arguments', function() {
    expect(TestBed.get(DeploymentsService).getPods).toHaveBeenCalledWith('space', 'environmentName', 'application');
  });

  it('should use pods data for initial desired replicas', function() {
    expect(testContext.testedDirective.desiredReplicas).toEqual(2);
  });

  it('should increment desired replicas on scale up by one', function() {
    let desired: number = 2;
    expect(testContext.testedDirective.desiredReplicas).toBe(desired);

    testContext.testedDirective.scaleUp();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(desired + 1);
  });

  it('should decrement desired replicas on scale down by one', function() {
    let desired: number = 2;
    expect(testContext.testedDirective.desiredReplicas).toBe(desired);

    testContext.testedDirective.scaleDown();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', function() {
    let desired: number = 2;
    expect(testContext.testedDirective.desiredReplicas).toBe(desired);

    testContext.testedDirective.scaleDown();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(desired - 1);

    testContext.testedDirective.scaleDown();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(0);

    testContext.testedDirective.scaleDown();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(0);
  });

  it('should acquire pods data', function(done: DoneFn) {
    testContext.testedDirective.pods.subscribe((pods: Pods) => {
      expect(pods).toEqual({
        pods: [['Running' as PodPhase, 1], ['Terminating' as PodPhase, 1]],
        total: 2
      });
      done();
    });
  });

  it('should call scalePods when scaling up', function() {
    let de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleUp'));
    let el: any = de.nativeElement;

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
  });

  it('should call scalePods when scaling down', function() {
    let de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleDown'));
    let el: any = de.nativeElement;

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);
  });

  it('should not call scalePods when scaling below 0', function() {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
    let de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleDown'));
    let el: any = de.nativeElement;

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 0);

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledTimes(2);
  });

  it('should not call notifications when scaling successfully', function() {
    testContext.testedDirective.scaleUp();
    testContext.detectChanges();
    testContext.testedDirective.debounceScale.flush();

    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
    expect(TestBed.get(NotificationsService).message).not.toHaveBeenCalled();
  });

  describe('atQuota', () => {
    it('should default to "false"', function() {
      expect(testContext.testedDirective.atQuota).toBeFalsy();
    });

    it('should be "false" when both stats are below quota', function() {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.getEnvironmentCpuStat().next({ used: 0, quota: 2 });
      mockSvc.getEnvironmentMemoryStat().next({ used: 0, quota: 2, units: MemoryUnit.GB });
      expect(testContext.testedDirective.atQuota).toBeFalsy();
    });

    it('should be "true" when CPU usage reaches quota', function() {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.getEnvironmentCpuStat().next({ used: 2, quota: 2 });
      mockSvc.getEnvironmentMemoryStat().next({ used: 1, quota: 2, units: MemoryUnit.GB });
      expect(testContext.testedDirective.atQuota).toBeTruthy();
    });

    it('should be "true" when Memory usage reaches quota', function() {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.getEnvironmentCpuStat().next({ used: 1, quota: 2 });
      mockSvc.getEnvironmentMemoryStat().next({ used: 2, quota: 2, units: MemoryUnit.GB });
      expect(testContext.testedDirective.atQuota).toBeTruthy();
    });

    it('should be "true" when both stats usage reaches quota', function() {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.getEnvironmentCpuStat().next({ used: 2, quota: 2 });
      mockSvc.getEnvironmentMemoryStat().next({ used: 2, quota: 2, units: MemoryUnit.GB });
      expect(testContext.testedDirective.atQuota).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should notify if scaling pods has an error', function() {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.scalePods.and.returnValue(_throw('scalePods error'));

      testContext.testedDirective.scaleUp();
      testContext.detectChanges();
      testContext.testedDirective.debounceScale.flush();

      expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
      expect(TestBed.get(NotificationsService).message).toHaveBeenCalled();
    });
  });
});
