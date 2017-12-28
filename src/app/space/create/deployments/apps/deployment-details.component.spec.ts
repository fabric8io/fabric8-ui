import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Environment } from '../models/environment';
import { DeploymentsService } from '../services/deployments.service';

import { DeploymentDetailsComponent } from './deployment-details.component';

// Makes patternfly charts available
import { ChartModule } from 'patternfly-ng';
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  template: '<deployment-details></deployment-details>'
})
class HostComponent { }

@Component({
  selector: 'deployments-donut',
  template: ''
})
class FakeDeploymentsDonutComponent {
  @Input() mini: boolean;
  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;
}

@Component({
  selector: 'deployment-graph-label',
  template: ''
})
class FakeDeploymentGraphLabelComponent {
  @Input() type: any;
  @Input() dataMeasure: any;
  @Input() value: any;
  @Input() valueUpperBound: any;
}

@Component({
  selector: 'pfng-chart-sparkline',
  template: ''
})
class FakePfngChartSparkline {
  @Input() config: any;
  @Input() chartData: any;
}

describe('DeploymentDetailsComponent', () => {
  type Context =  TestContext<DeploymentDetailsComponent, HostComponent>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let mockEnvironment: Environment;

  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
    mockSvc.getCpuStat.and.returnValue(Observable.of({ used: 1, quota: 2 }));
    mockSvc.getMemoryStat.and.returnValue(Observable.of({ used: 3, quota: 4, units: 'GB' }));
    mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
    mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
    mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
    mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));

    mockEnvironment = { name: 'mockEnvironment' } as Environment;
  });

  initContext(DeploymentDetailsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    declarations: [
      DeploymentDetailsComponent,
      FakeDeploymentsDonutComponent,
      FakeDeploymentGraphLabelComponent,
      FakePfngChartSparkline
    ],
    providers: [
      { provide: DeploymentsService, useFactory: () => mockSvc }
    ]
  }, component => {
    component.collapsed = false;
    component.applicationId = 'mockAppId';
    component.environment = mockEnvironment;
    component.spaceId = 'mockSpaceId';
  });

  it('should generate unique chartIds for each DeploymentDetailsComponent instance', () => {
    let detailsComponent = new DeploymentDetailsComponent(mockSvc);
    expect(detailsComponent.cpuConfig.chartId).not.toBe(detailsComponent.memConfig.chartId);
  });

  it('should create a child donut component with proper values', function (this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeDeploymentsDonutComponent));
    expect(arrayOfComponents.length).toEqual(1);

    let container = arrayOfComponents[0].componentInstance;
    expect(container.applicationId).toEqual('mockAppId');
  });

  describe('cpu label', () => {
    let de: DebugElement;

    beforeEach(function (this: Context) {
      let charts = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let cpuChart = charts[0];
      de = cpuChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should be called with the proper arguments', () => {
      expect(mockSvc.getCpuStat).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
    });

    it('should use the \'Cores\' label for its data measure', () => {
      expect(de.componentInstance.dataMeasure).toEqual('Cores');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(1);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(2);
    });
  });

  describe('memory label', () => {
    let de: DebugElement;

    beforeEach(function (this: Context) {
      let charts = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let memoryChart = charts[1];
      de = memoryChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should use units from service result', () => {
      expect(mockSvc.getMemoryStat).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
      expect(de.componentInstance.dataMeasure).toEqual('GB');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(3);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(4);
    });
  });
});
