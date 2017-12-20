import {
  Component,
  Input
} from '@angular/core';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { createMock } from 'testing/mock';

import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { DeploymentsDonutComponent } from './deployments-donut.component';
import { DeploymentsService } from '../services/deployments.service';
import { Environment } from '../models/environment';
import { Pods } from '../models/pods';

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

  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.scalePods.and.returnValue(
      Observable.of('scalePods')
    );
    mockSvc.getPods.and.returnValue(
      Observable.of({ pods: [['Running', 1], ['Terminating', 1]], total: 2 } as Pods)
    );
  });

  initContext(DeploymentsDonutComponent, HostComponent,
    {
      declarations: [FakeDeploymentsDonutChartComponent],
      providers: [{ provide: DeploymentsService, useFactory: () => mockSvc }]
    },
    component => {
      component.mini = false;
      component.spaceId = 'space';
      component.applicationId = 'application';
      component.environment = { name: 'environmentName' } as Environment;
    });

  it('should use pods data for initial desired replicas', function (this: Context) {
    expect(this.testedDirective.desiredReplicas).toEqual(2);
  });

  it('should increment desired replicas on scale up by one', function (this: Context) {
    let desired = 2;
    expect(this.testedDirective.desiredReplicas).toBe(desired);

    this.testedDirective.scaleUp();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(desired + 1);
  });

  it('should decrement desired replicas on scale down by one', function (this: Context) {
    let desired = 2;
    expect(this.testedDirective.desiredReplicas).toBe(desired);

    this.testedDirective.scaleDown();
    this.detectChanges();
    expect(this.testedDirective.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', function (this: Context) {
    let desired = 2;
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

  it('should acquire pods data', function (this: Context, done: DoneFn) {
    this.testedDirective.pods.subscribe(pods => {
      expect(pods).toEqual({
        pods: [['Running', 1], ['Terminating', 1]],
        total: 2
      });
      done();
    });
  });

  it('should call scalePods when scaling up', function (this: Context) {
    let de = this.fixture.debugElement.query(By.css('#scaleUp'));
    let el = de.nativeElement;

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
  });

  it('should call scalePods when scaling down', function (this: Context) {
    let de = this.fixture.debugElement.query(By.css('#scaleDown'));
    let el = de.nativeElement;

    el.click();
    this.testedDirective.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);
  });

  it('should not call scalePods when scaling below 0', function (this: Context) {
    let de = this.fixture.debugElement.query(By.css('#scaleDown'));
    let el = de.nativeElement;

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
});
