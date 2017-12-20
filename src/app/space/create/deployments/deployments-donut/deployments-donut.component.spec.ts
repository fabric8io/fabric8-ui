import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Component,
  DebugElement,
  Input
} from '@angular/core';


import { By } from '@angular/platform-browser';

import { isEqual } from 'lodash';
import { Observable } from 'rxjs';

import { DeploymentsDonutComponent } from './deployments-donut.component';
import { DeploymentsService } from '../services/deployments.service';
import { Pods } from '../models/pods';

import { createMock } from '../../../../../testing/mock';

@Component({
  selector: 'deployments-donut-chart',
  template: ''
})
class FakeDeploymentsDonutChartComponent {
  @Input() desiredReplicas: number;
  @Input() idled: boolean;
  @Input() mini: boolean;
  @Input() pods: any[];
}

describe('DeploymentsDonutComponent', () => {
  let component: DeploymentsDonutComponent;
  let fixture: ComponentFixture<DeploymentsDonutComponent>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;

  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.scalePods.and.returnValue(
      Observable.of('scalePods')
    );
    mockSvc.getPods.and.returnValue(
      Observable.of({ pods: [['Running', 1], ['Terminating', 1]], total: 2 } as Pods)
    );

    TestBed.configureTestingModule({
      declarations: [DeploymentsDonutComponent, FakeDeploymentsDonutChartComponent],
      providers: [{ provide: DeploymentsService, useFactory: () => mockSvc }]
    });

    fixture = TestBed.createComponent(DeploymentsDonutComponent);
    component = fixture.componentInstance;

    component.mini = false;
    component.spaceId = 'space';
    component.applicationId = 'application';
    component.environment = { environmentId: 'environmentId', name: 'environmentName' };

    fixture.detectChanges();
  });

  it('should use pods data for initial desired replicas', () => {
    expect(component.desiredReplicas).toEqual(2);
  });

  it('should increment desired replicas on scale up by one', () => {
    let desired = 2;
    expect(component.desiredReplicas).toBe(desired);

    component.scaleUp();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(desired + 1);
  });

  it('should decrement desired replicas on scale down by one', () => {
    let desired = 2;
    expect(component.desiredReplicas).toBe(desired);

    component.scaleDown();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', () => {
    let desired = 2;
    expect(component.desiredReplicas).toBe(desired);

    component.scaleDown();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(desired - 1);

    component.scaleDown();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(0);
  });

  it('should acquire pods data', (done: DoneFn) => {
    component.pods.subscribe(pods => {
      expect(pods).toEqual({
        pods: [['Running', 1], ['Terminating', 1]],
        total: 2
      });
      done();
    });
  });

  it('should call scalePods when scaling up', () => {
    de = fixture.debugElement.query(By.css('#scaleUp'));
    el = de.nativeElement;

    el.click();
    component.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 3);
  });

  it('should call scalePods when scaling down', () => {
    de = fixture.debugElement.query(By.css('#scaleDown'));
    el = de.nativeElement;

    el.click();
    component.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);
  });

  it('should not call scalePods when scaling below 0', () => {
    de = fixture.debugElement.query(By.css('#scaleDown'));
    el = de.nativeElement;

    el.click();
    component.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 1);

    el.click();
    component.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledWith('space', 'environmentName', 'application', 0);


    el.click();
    component.debounceScale.flush();
    expect(mockSvc.scalePods).toHaveBeenCalledTimes(2);
  });
});
