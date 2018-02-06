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
import { Pods } from '../models/pods';
import { ScaledNetworkStat } from '../models/scaled-network-stat';
import {
  DeploymentsService,
  NetworkStat,
  TimeConstrainedStats
} from '../services/deployments.service';
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
  [spaceId]="spaceId"
  [active]="detailsActive">
  </deployment-details>`
})
class HostComponent {
  public collapsed: boolean = false;
  public applicationId: string = 'mockAppId';
  public environment: Environment = { name: 'mockEnvironment' };
  public spaceId: string = 'mockSpaceId';
  public detailsActive: boolean = true;
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
  selector: 'f8-deployments-linechart',
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
  let netStatObservable: BehaviorSubject<NetworkStat>;
  let podsObservable: BehaviorSubject<Pods>;
  let initialStatsObservable: BehaviorSubject<TimeConstrainedStats>;

  beforeEach(() => {
    cpuStatObservable = new BehaviorSubject({ used: 1, quota: 2 } as CpuStat);
    memStatObservable = new BehaviorSubject({ used: 3, quota: 4, units: 'GB' } as MemoryStat);

    const mb = Math.pow(1024, 2);
    netStatObservable = new BehaviorSubject({
      sent: new ScaledNetworkStat(1 * mb),
      received: new ScaledNetworkStat(2 * mb)
    } as NetworkStat);

    podsObservable = new BehaviorSubject(
      { total: 1, pods: [['Running', 1], ['Starting', 0], ['Stopping', 0]] } as Pods
    );

    initialStatsObservable = new BehaviorSubject({
      cpu: [
        { data: { used: 2, quota: 2 }, timestamp: 1234567891011 }
      ],
      memory: [
        { data: { used: 2, quota: 4, units: 'GB' }, timestamp: 1234567891011 }
      ],
      network: [
        { data: { sent: new ScaledNetworkStat(2 * mb), received: new ScaledNetworkStat(1 * mb) }, timestamp: 1234567891011 }
      ]
    } as TimeConstrainedStats);

    mockSvc = createMock(DeploymentsService);
    mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
    mockSvc.getDeploymentCpuStat.and.returnValue(cpuStatObservable);
    mockSvc.getDeploymentMemoryStat.and.returnValue(memStatObservable);
    mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
    mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
    mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
    mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));
    mockSvc.getDeploymentNetworkStat.and.returnValue(netStatObservable);
    mockSvc.getPods.and.returnValue(podsObservable);
    mockSvc.getDeploymentTimeConstrainedStats.and.returnValue(initialStatsObservable);
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

  describe('hasPods', () => {
    it('should be true for initial state', function(this: Context, done: DoneFn) {
      this.testedDirective.hasPods.subscribe((b: boolean) => {
        expect(b).toBeTruthy();
        done();
      });
    });

    it('should be false for state without pods', function(this: Context, done: DoneFn) {
      podsObservable.next({ total: 0, pods: [] });
      this.testedDirective.hasPods.subscribe((b: boolean) => {
        expect(b).toBeFalsy();
        done();
      });
    });
  });

  describe('initial data', () => {
    it('should request the last 15 minutes worth of deployments data on chart initialization', () => {
      expect(mockSvc.getDeploymentTimeConstrainedStats).toHaveBeenCalledWith('mockSpaceId', 'mockAppId', 'mockEnvironment', DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION);
    });

    it('should have cpu information be added first to the cpuData data structure', function(this: Context) {
      let detailsComponent = this.testedDirective;
      expect(detailsComponent.cpuData.xData.length).toEqual(3);
      expect(detailsComponent.cpuData.yData[1]).toEqual(2); // value of 2 from initialStatsObservable
      expect(detailsComponent.cpuData.yData[2]).toEqual(1); // value of 1 from cpuStatObservable
    });

    it('should have memory information be added first to the memData data structure', function(this: Context) {
      let detailsComponent = this.testedDirective;
      expect(detailsComponent.memData.xData.length).toEqual(3);
      expect(detailsComponent.memData.yData[1]).toEqual(2); // value of 2 from initialStatsObservable
      expect(detailsComponent.memData.yData[2]).toEqual(3); // value of 3 from memStatObservable
    });

    it('should have network information be added first to the netData data structure', function(this: Context) {
      let detailsComponent = this.testedDirective;
      let mb = Math.pow(1024, 2);
      expect(detailsComponent.netData.xData.length).toEqual(3);
      expect(detailsComponent.netData.yData[0][1]).toEqual(2 * mb); // value of 2 * mb from initialStatsObservable
      expect(detailsComponent.netData.yData[0][2]).toEqual(1 * mb); // value of 1 * mb from netStatObservable
    });
  });

  describe('cpu label', () => {
    let de: DebugElement;

    beforeEach(function(this: Context) {
      let charts = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let cpuChart = charts[0];
      de = cpuChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should be called with the proper arguments', () => {
      expect(mockSvc.getDeploymentCpuStat).toHaveBeenCalledWith('mockSpaceId', 'mockAppId', 'mockEnvironment');
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
      expect(mockSvc.getDeploymentMemoryStat).toHaveBeenCalledWith('mockSpaceId', 'mockAppId', 'mockEnvironment');
      expect(de.componentInstance.dataMeasure).toEqual('GB');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(3);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(4);
    });
  });

  describe('network label', () => {
    let de: DebugElement;

    beforeEach(function(this: Context) {
      let charts = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let networkChart = charts[2];
      de = networkChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should call to service', () => {
      expect(mockSvc.getDeploymentNetworkStat).toHaveBeenCalledWith('mockSpaceId', 'mockAppId', 'mockEnvironment');
    });

    it('should use \'MB/s\' units', () => {
      expect(de.componentInstance.dataMeasure).toEqual('MB/s');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(3); // sent: 1 + received: 2
    });

    it('should have no upper bound', () => {
      expect(de.componentInstance.valueUpperBound).toBeFalsy();
    });
  });

  describe('charts', () => {
    it('by default should be the default data duration divided by the polling rate', function(this: Context) {
      let detailsComponent = this.testedDirective;
      let expectedDefaultElements =
        DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION / DeploymentsService.POLL_RATE_MS;
      expect(detailsComponent.getChartMaxElements()).toBe(expectedDefaultElements);
    });

    it('should not be able to be set to anything less than 1', function(this: Context) {
      let detailsComponent = this.testedDirective;
      [0, -5, -1873].forEach(n => {
        detailsComponent.setChartMaxElements(n);
        expect(detailsComponent.getChartMaxElements()).toBe(1);
      });
    });

    describe('sparkline data', () => {
      it('should have its cpu data bounded when enough data has been emitted', function(this: Context) {
        const MAX_CPU_SPARKLINE_ELEMENTS = 4;
        let detailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_CPU_SPARKLINE_ELEMENTS);
        times(MAX_CPU_SPARKLINE_ELEMENTS + 10, () => cpuStatObservable.next({ used: 1, quota: 2 }));
        expect(detailsComponent.cpuData.xData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
        expect(detailsComponent.cpuData.yData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
      });

      it('should have its memory data bounded when enough data has been emitted', function(this: Context) {
        const MAX_MEM_SPARKLINE_ELEMENTS = 6;
        let detailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_MEM_SPARKLINE_ELEMENTS);
        times(MAX_MEM_SPARKLINE_ELEMENTS + 10, () => memStatObservable.next({ used: 3, quota: 4, units: 'GB' }));
        expect(detailsComponent.memData.xData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
        expect(detailsComponent.memData.yData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
      });
    });

    describe('linechart data', () => {
      it('should have its net data bounded when enough data has been emitted', function(this: Context) {
        const MAX_NET_LINE_ELEMENTS = 4;
        let detailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_NET_LINE_ELEMENTS);
        times(MAX_NET_LINE_ELEMENTS + 10,
          () => netStatObservable.next({ sent: new ScaledNetworkStat(3), received: new ScaledNetworkStat(4) }));
        expect(detailsComponent.netData.xData.length).toBe(MAX_NET_LINE_ELEMENTS);
        expect(detailsComponent.netData.yData[0].length).toBe(MAX_NET_LINE_ELEMENTS);
      });
    });
  });

});
