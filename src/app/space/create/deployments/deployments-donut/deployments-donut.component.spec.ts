import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Component,
  Input
} from '@angular/core';

import { isEqual } from 'lodash';
import { Observable } from 'rxjs';

import { DeploymentsDonutComponent } from './deployments-donut.component';
import { DeploymentsService } from '../services/deployments.service';
import { Pods } from '../models/pods';

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
  let mockSvc: DeploymentsService;

  beforeEach(() => {
    mockSvc = {
      getApplications: () => { throw 'NotImplemented'; },
      getEnvironments: () => { throw 'NotImplemented'; },
      getPods: (spaceId: string, appId: string, envId: string) => Observable.of({
        pods: [['Running', 1], ['Terminating', 1]],
        total: 2
      } as Pods),
      getVersion: () => { throw 'NotImplemented'; },
      getCpuStat: (spaceId: string, envId: string) => { throw 'NotImplemented'; },
      getMemoryStat: (spaceId: string, envId: string) => { throw 'NotImplemented'; },
      getLogsUrl: () => { throw 'Not Implemented'; },
      getConsoleUrl: () => { throw 'Not Implemented'; },
      getAppUrl: () => { throw 'Not Implemented'; },
      deleteApplication: () => { throw 'Not Implemented'; }
    };

    TestBed.configureTestingModule({
      declarations: [DeploymentsDonutComponent, FakeDeploymentsDonutChartComponent],
      providers: [{ provide: DeploymentsService, useValue: mockSvc }]
    });

    fixture = TestBed.createComponent(DeploymentsDonutComponent);
    component = fixture.componentInstance;

    component.mini = false;
    component.applicationId = 'application';

    fixture.detectChanges();
  });

  it('should default with 1 desired replica', () => {
    expect(component.desiredReplicas).toBe(1);
  });

  it('should increment desired replicas on scale up by one', () => {
    let desired = 1;
    expect(component.desiredReplicas).toBe(desired);

    component.scaleUp();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(desired + 1);
  });

  it('should decrement desired replicas on scale down by one', () => {
    let desired = 1;
    expect(component.desiredReplicas).toBe(desired);

    component.scaleDown();
    fixture.detectChanges();
    expect(component.desiredReplicas).toBe(desired - 1);
  });

  it('should not decrement desired replicas below zero when scaling down', () => {
    let desired = 1;
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
});
