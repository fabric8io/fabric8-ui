import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import 'patternfly/dist/js/patternfly-settings.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentDetailsComponent } from './deployment-details.component';

import { times } from 'lodash';

// Makes patternfly charts available
import { ChartModule } from 'patternfly-ng';
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  template: `<deployment-details
  [collapsed]="collapsed"
  [applicationId]="applicationId"
  [environment]="environment"
  [spaceId]="spaceId">
  </deployment-details>`
})
class HostComponent {
  public collapsed: boolean = false;
  public applicationId: string = 'mockAppId';
  public environment: Environment = { name: 'mockEnvironment' };
  public spaceId: string = 'mockSpaceId';
}

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

@Component({
  selector: 'deployments-linechart',
  template: ''
})
class FakeDeploymentsLinechart {
  @Input() config: any;
  @Input() chartData: any;
}

describe('DeploymentDetailsComponent', () => {
  type Context = TestContext<DeploymentDetailsComponent, HostComponent>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let cpuStatObservable: BehaviorSubject<CpuStat>;
  let memStatObservable: BehaviorSubject<MemoryStat>;

  beforeEach(() => {
    cpuStatObservable = new BehaviorSubject({ used: 1, quota: 2 } as CpuStat);
    memStatObservable = new BehaviorSubject({ used: 3, quota: 4, units: 'GB' } as MemoryStat);

    mockSvc = createMock(DeploymentsService);
    mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
    mockSvc.getCpuStat.and.returnValue(cpuStatObservable);
    mockSvc.getMemoryStat.and.returnValue(memStatObservable);
    mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
    mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
    mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
    mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));
    mockSvc.getDeploymentNetworkStat.and.returnValue(Observable.of({ sent: 1, received: 2 }));
  });

  initContext(DeploymentDetailsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    declarations: [
      FakeDeploymentsDonutComponent,
      FakeDeploymentGraphLabelComponent,
      FakePfngChartSparkline,
      FakeDeploymentsLinechart
    ],
    providers: [
      { provide: DeploymentsService, useFactory: () => mockSvc }
    ]
  });

  it('should generate unique chartIds for each DeploymentDetailsComponent instance', function(this: Context) {
    let detailsComponent = this.testedDirective;
    expect(detailsComponent.cpuConfig.chartId).not.toBe(detailsComponent.memConfig.chartId);
  });

  it('should create a child donut component with proper values', function(this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeDeploymentsDonutComponent));
    expect(arrayOfComponents.length).toEqual(1);

    let container = arrayOfComponents[0].componentInstance;
    expect(container.applicationId).toEqual('mockAppId');
  });

  describe('cpu label', () => {
    let de: DebugElement;

    beforeEach(function(this: Context) {
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

    beforeEach(function(this: Context) {
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

  describe('sparkline data', () => {
    it('by default should be the default data duration divided by the polling rate', function(this: Context) {
      let detailsComponent = this.testedDirective;
      let expectedDefaultElements =
        DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION / DeploymentsService.POLL_RATE_MS;
      expect(detailsComponent.getSparklineMaxElements()).toBe(expectedDefaultElements);
    });

    it('should not be able to be set to anything less than 1', function(this: Context) {
      let detailsComponent = this.testedDirective;
      [0, -5, -1873].forEach(n => {
        detailsComponent.setSparklineMaxElements(n);
        expect(detailsComponent.getSparklineMaxElements()).toBe(1);
      });
    });

    it('should have its cpu data bounded when enough data has been emitted', function(this: Context) {
      const MAX_CPU_SPARKLINE_ELEMENTS = 4;
      let detailsComponent = this.testedDirective;
      detailsComponent.setSparklineMaxElements(MAX_CPU_SPARKLINE_ELEMENTS);
      times(MAX_CPU_SPARKLINE_ELEMENTS + 10, () => cpuStatObservable.next({ used: 1, quota: 2 }));
      expect(detailsComponent.cpuData.xData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
      expect(detailsComponent.cpuData.yData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
    });

    it('should have its memory data bounded when enough data has been emitted', function(this: Context) {
      const MAX_MEM_SPARKLINE_ELEMENTS = 6;
      let detailsComponent = this.testedDirective;
      detailsComponent.setSparklineMaxElements(MAX_MEM_SPARKLINE_ELEMENTS);
      times(MAX_MEM_SPARKLINE_ELEMENTS + 10, () => memStatObservable.next({ used: 3, quota: 4, units: 'GB' }));
      expect(detailsComponent.memData.xData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
      expect(detailsComponent.memData.yData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
    });
  });

});
