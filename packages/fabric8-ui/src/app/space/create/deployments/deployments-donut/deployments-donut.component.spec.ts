import { Component, DebugElement, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';

import { createMock } from 'testing/mock';
import { initContext } from 'testing/test-context';
import { NotificationsService } from '../../../../shared/notifications.service';
import { PodPhase } from '../models/pod-phase';
import { Pods } from '../models/pods';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentsDonutComponent } from './deployments-donut.component';

@Component({
  template: '<deployments-donut></deployments-donut>',
})
class HostComponent {}

@Component({
  selector: 'deployments-donut-chart',
  template: '',
})
class FakeDeploymentsDonutChartComponent {
  @Input() desiredReplicas: number;
  @Input() idled: boolean;
  @Input() mini: boolean;
  @Input() pods: any[];
  @Input() colors: any;
}

describe('DeploymentsDonutComponent', (): void => {
  const testContext = initContext(
    DeploymentsDonutComponent,
    HostComponent,
    {
      declarations: [FakeDeploymentsDonutChartComponent],
      providers: [
        {
          provide: DeploymentsService,
          useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
            svc.scalePods.and.returnValue(of('scalePods'));
            svc.getPods.and.returnValue(
              new BehaviorSubject<Pods>({
                pods: [[PodPhase.RUNNING, 1], [PodPhase.TERMINATING, 1]],
                total: 2,
              }),
            );
            svc.canScale.and.returnValue(new Subject<boolean>());
            svc.getMaximumPods.and.returnValue(of(2));
            return svc;
          },
        },
        {
          provide: NotificationsService,
          useValue: jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']),
        },
      ],
    },
    (component: DeploymentsDonutComponent): void => {
      component.mini = false;
      component.spaceId = 'space';
      component.applicationId = 'application';
      component.environment = 'environmentName';
    },
  );

  it('should get the pods with the correct arguments', (): void => {
    expect(TestBed.get(DeploymentsService).getPods).toHaveBeenCalledWith(
      'space',
      'environmentName',
      'application',
    );
  });

  it('should use pods data for initial desired replicas', (): void => {
    expect(testContext.testedDirective.desiredReplicas).toEqual(2);
  });

  it('should increment desired replicas on scale up by one', (): void => {
    const desired: number = 2;
    expect(testContext.testedDirective.desiredReplicas).toBe(desired);

    testContext.testedDirective.scaleUp();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(desired + 1);
  });

  it('should detect when detected scale attempt reaches maximum supported pods', (): void => {
    TestBed.get(DeploymentsService)
      .getPods()
      .next({ pods: [], total: 0 });

    expect(testContext.testedDirective.desiredReplicas).toBe(0);
    expect(testContext.testedDirective.requestedScaleIsMaximum).toBeFalsy();

    testContext.testedDirective.scaleUp();
    expect(testContext.testedDirective.desiredReplicas).toBe(1);
    expect(testContext.testedDirective.requestedScaleIsMaximum).toBeFalsy();

    testContext.testedDirective.scaleUp();
    expect(testContext.testedDirective.desiredReplicas).toBe(2);
    expect(testContext.testedDirective.requestedScaleIsMaximum).toBeTruthy();

    testContext.testedDirective.scaleDown();
    expect(testContext.testedDirective.desiredReplicas).toBe(1);
    expect(testContext.testedDirective.requestedScaleIsMaximum).toBeFalsy();

    testContext.testedDirective.scaleDown();
    expect(testContext.testedDirective.desiredReplicas).toBe(0);
    expect(testContext.testedDirective.requestedScaleIsMaximum).toBeFalsy();
  });

  it('should decrement desired replicas on scale down by one', (): void => {
    const desired: number = 2;
    expect(testContext.testedDirective.desiredReplicas).toBe(desired);

    testContext.testedDirective.scaleDown();
    testContext.detectChanges();
    expect(testContext.testedDirective.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', (): void => {
    const desired: number = 2;
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

  it('should acquire pods data', (done: DoneFn): void => {
    testContext.testedDirective.pods.subscribe(
      (pods: Pods): void => {
        expect(pods).toEqual({
          pods: [[PodPhase.RUNNING, 1], [PodPhase.TERMINATING, 1]],
          total: 2,
        });
        done();
      },
    );
  });

  it('should call scalePods when scaling up', (): void => {
    const de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleUp'));
    const el: HTMLElement = de.nativeElement;

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith(
      'space',
      'environmentName',
      'application',
      3,
    );
  });

  it('should call scalePods when scaling down', (): void => {
    const de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleDown'));
    const el: HTMLElement = de.nativeElement;

    el.click();
    testContext.testedDirective.debounceScale.flush();
    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith(
      'space',
      'environmentName',
      'application',
      1,
    );
  });

  it('should not call scalePods when scaling below 0', (): void => {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
    const de: DebugElement = testContext.fixture.debugElement.query(By.css('#scaleDown'));
    const el: HTMLElement = de.nativeElement;

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

  it('should not call notifications when scaling successfully', (): void => {
    testContext.testedDirective.scaleUp();
    testContext.detectChanges();
    testContext.testedDirective.debounceScale.flush();

    expect(TestBed.get(DeploymentsService).scalePods).toHaveBeenCalledWith(
      'space',
      'environmentName',
      'application',
      3,
    );
    expect(TestBed.get(NotificationsService).message).not.toHaveBeenCalled();
  });

  describe('atQuota', (): void => {
    it('should default to "false"', (): void => {
      expect(testContext.testedDirective.atQuota).toBeFalsy();
    });

    it('should mirror inverted DeploymentsService#canScale()', (): void => {
      TestBed.get(DeploymentsService)
        .canScale()
        .next(true);
      expect(testContext.testedDirective.atQuota).toBeFalsy();

      TestBed.get(DeploymentsService)
        .canScale()
        .next(false);
      expect(testContext.testedDirective.atQuota).toBeTruthy();
    });
  });

  describe('error handling', (): void => {
    it('should notify if scaling pods has an error', (): void => {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      mockSvc.scalePods.and.returnValue(throwError('scalePods error'));

      testContext.testedDirective.scaleUp();
      testContext.detectChanges();
      testContext.testedDirective.debounceScale.flush();

      expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
      expect(TestBed.get(NotificationsService).message).toHaveBeenCalled();
    });
  });
});
