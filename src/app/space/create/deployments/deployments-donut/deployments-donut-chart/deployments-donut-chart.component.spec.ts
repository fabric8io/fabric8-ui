import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { isEqual } from 'lodash';

import { DeploymentsDonutChartComponent } from './deployments-donut-chart.component';

describe('DeploymentsDonutChartComponent', () => {
  let component: DeploymentsDonutChartComponent;
  let fixture: ComponentFixture<DeploymentsDonutChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeploymentsDonutChartComponent]
    });

    fixture = TestBed.createComponent(DeploymentsDonutChartComponent);
    component = fixture.componentInstance;

    component.pods = [
      {
        status: {
          phase: 'Running'
        }
      }, {
        status: {
          phase: 'Terminating'
        }
      }
    ];
    component.mini = false;
    component.desiredReplicas = 1;
    component.idled = false;

    fixture.detectChanges();
    component.debounceUpdate.flush();
  });

  it('should set unique chartId', () => {
    expect(component.chartId).toMatch('deployments-donut-chart.*');
  });

  it('should set podStatusData', () => {
    let expectedPodStatusData = [
      ['Running', 1],
      ['Not Ready', 0],
      ['Warning', 0],
      ['Error', 0],
      ['Pulling', 0],
      ['Pending', 0],
      ['Succeeded', 0],
      ['Terminating', 1],
      ['Unknown', 0]
    ];
    component.debounceUpdate.flush();
    expect(component.podStatusData).toEqual(expectedPodStatusData);
  });

  it('should update podStatusData', () => {
    let expectedPodStatusData = [
      ['Running', 1],
      ['Not Ready', 0],
      ['Warning', 0],
      ['Error', 0],
      ['Pulling', 0],
      ['Pending', 0],
      ['Succeeded', 0],
      ['Terminating', 1],
      ['Unknown', 0]
    ];
    component.debounceUpdate.flush();
    expect(component.podStatusData).toEqual(expectedPodStatusData);

    expectedPodStatusData = [
      ['Running', 2],
      ['Not Ready', 0],
      ['Warning', 0],
      ['Error', 0],
      ['Pulling', 0],
      ['Pending', 0],
      ['Succeeded', 0],
      ['Terminating', 0],
      ['Unknown', 0]
    ];

    component.pods = [{
      status: {
        phase: 'Running'
      }
    }, {
      status: {
        phase: 'Running'
      }
    }];

    fixture.detectChanges();
    component.debounceUpdate.flush();

    expect(component.podStatusData).toEqual(expectedPodStatusData);
  });
});
