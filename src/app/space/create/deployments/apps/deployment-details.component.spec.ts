import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';
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
  NetworkStat
} from '../services/deployments.service';
import { DeploymentDetailsComponent } from './deployment-details.component';

import { times } from 'lodash';

// Makes patternfly charts available
import {
  ChartModule,
  SparklineConfig,
  SparklineData
} from 'patternfly-ng';
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
  collapsed: boolean = false;
  applicationId: string = 'mockAppId';
  environment: Environment = { name: 'mockEnvironment' };
  spaceId: string = 'mockSpaceId';
  detailsActive: boolean = true;
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
  @Input() config: SparklineConfig;
  @Input() chartData: SparklineData;
}

describe('DeploymentDetailsComponent', () => {
  type Context = TestContext<DeploymentDetailsComponent, HostComponent>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let cpuStatObservable: BehaviorSubject<CpuStat>;
  let memStatObservable: BehaviorSubject<MemoryStat>;
  let netStatObservable: BehaviorSubject<NetworkStat>;
  let podsObservable: BehaviorSubject<Pods>;

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
    const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
    expect(detailsComponent.cpuConfig.chartId).not.toBe(detailsComponent.memConfig.chartId);
  });

  it('should create a child donut component with proper values', function(this: Context) {
    const arrayOfComponents: DebugElement[] =
      this.fixture.debugElement.queryAll(By.directive(FakeDeploymentsDonutComponent));
    expect(arrayOfComponents.length).toEqual(1);

    const container: DeploymentDetailsComponent = arrayOfComponents[0].componentInstance;
    expect(container.applicationId).toEqual('mockAppId');
  });

  describe('hasPods', () => {
    it('should be false for state without pods', function(this: Context, done: DoneFn) {
      podsObservable.next({ total: 0, pods: [] });
      this.testedDirective.hasPods.subscribe((b: boolean) => {
        expect(b).toBeFalsy();
        done();
      });
    });
  });

  describe('cpu label', () => {
    let de: DebugElement;

    beforeEach(function(this: Context) {
      const charts: DebugElement[] = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      const cpuChart: DebugElement = charts[0];
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
      const charts: DebugElement[] = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      const memoryChart: DebugElement = charts[1];
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
      const charts: DebugElement[] = this.fixture.debugElement.queryAll(By.css('.deployment-chart'));
      const networkChart: DebugElement = charts[2];
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
      const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
      const expectedDefaultElements: number =
        DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION / DeploymentsService.POLL_RATE_MS;
      expect(detailsComponent.getChartMaxElements()).toBe(expectedDefaultElements);
    });

    it('should not be able to be set to anything less than 1', function(this: Context) {
      const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
      [0, -5, -1873].forEach((n: number) => {
        detailsComponent.setChartMaxElements(n);
        expect(detailsComponent.getChartMaxElements()).toBe(1);
      });
    });

    describe('sparkline data', () => {
      it('should have its cpu data bounded when enough data has been emitted', function(this: Context) {
        const MAX_CPU_SPARKLINE_ELEMENTS = 4;
        const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_CPU_SPARKLINE_ELEMENTS);
        times(MAX_CPU_SPARKLINE_ELEMENTS + 10, () => cpuStatObservable.next({ used: 1, quota: 2 }));
        expect(detailsComponent.cpuData.xData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
        expect(detailsComponent.cpuData.yData.length).toBe(MAX_CPU_SPARKLINE_ELEMENTS);
      });

      it('should have its memory data bounded when enough data has been emitted', function(this: Context) {
        const MAX_MEM_SPARKLINE_ELEMENTS = 6;
        const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_MEM_SPARKLINE_ELEMENTS);
        times(MAX_MEM_SPARKLINE_ELEMENTS + 10, () => memStatObservable.next({ used: 3, quota: 4, units: 'GB' }));
        expect(detailsComponent.memData.xData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
        expect(detailsComponent.memData.yData.length).toBe(MAX_MEM_SPARKLINE_ELEMENTS);
      });
    });

    describe('linechart data', () => {
      it('should have its net data bounded when enough data has been emitted', function(this: Context) {
        const MAX_NET_LINE_ELEMENTS = 4;
        const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
        detailsComponent.setChartMaxElements(MAX_NET_LINE_ELEMENTS);
        times(MAX_NET_LINE_ELEMENTS + 10,
          () => netStatObservable.next({ sent: new ScaledNetworkStat(3), received: new ScaledNetworkStat(4) }));
        expect(detailsComponent.netData.xData.length).toBe(MAX_NET_LINE_ELEMENTS);
        expect(detailsComponent.netData.yData[0].length).toBe(MAX_NET_LINE_ELEMENTS);
      });

      it('should be rounded to whole numbers when units are bytes', function(this: Context) {
        netStatObservable.next({
          sent: new ScaledNetworkStat(100.567),
          received: new ScaledNetworkStat(200.234)
        } as NetworkStat);
        this.detectChanges();
        const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
        expect(detailsComponent.netVal).toEqual(301);
        expect(detailsComponent.netData.xData.length).toEqual(3);
        expect(detailsComponent.netData.yData.length).toEqual(2);
        expect(detailsComponent.netData.yData[0][2]).toEqual(101);
        expect(detailsComponent.netData.yData[1][2]).toEqual(200);
      });

      it('should be rounded to tenths when units are larger than bytes', function(this: Context) {
        netStatObservable.next({
          sent: new ScaledNetworkStat(12.34 * 1024),
          received: new ScaledNetworkStat(45.67 * 1024)
        } as NetworkStat);
        this.detectChanges();
        const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
        expect(detailsComponent.netVal).toEqual(58);
        expect(detailsComponent.netData.xData.length).toEqual(3);
        expect(detailsComponent.netData.yData.length).toEqual(2);
        expect(detailsComponent.netData.yData[0][2]).toEqual(12636.2);
        expect(detailsComponent.netData.yData[1][2]).toEqual(46766.1);
      });
    });
  });

});
