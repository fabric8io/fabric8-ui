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
import { MemoryStat } from '../models/memory-stat';
import { Pods } from '../models/pods';
import { ScaledNetworkStat } from '../models/scaled-network-stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import {
  DeploymentsService,
  NetworkStat
} from '../services/deployments.service';
import { DeploymentDetailsComponent } from './deployment-details.component';

import { times } from 'lodash';

// Makes patternfly charts available
import {
  ChartDefaults,
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
  environment: string = 'mockEnvironment';
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
  @Input() environment: string;
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
  let mockStatusSvc: jasmine.SpyObj<DeploymentStatusService>;
  let status: Subject<Status>;
  let cpuStatObservable: BehaviorSubject<CpuStat[]>;
  let memStatObservable: BehaviorSubject<MemoryStat[]>;
  let netStatObservable: BehaviorSubject<NetworkStat[]>;
  let podsObservable: BehaviorSubject<Pods>;

  beforeEach(() => {
    cpuStatObservable = new BehaviorSubject([{ used: 1, quota: 2, timestamp: 1 }] as CpuStat[]);
    memStatObservable = new BehaviorSubject([{ used: 3, quota: 4, units: 'GB', timestamp: 1 }] as MemoryStat[]);

    const mb = Math.pow(1024, 2);
    netStatObservable = new BehaviorSubject([{
      sent: new ScaledNetworkStat(1 * mb, 1),
      received: new ScaledNetworkStat(2 * mb, 1)
    }] as NetworkStat[]);

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
    mockSvc.deleteDeployment.and.returnValue(Observable.of('mockDeletedMessage'));
    mockSvc.getDeploymentNetworkStat.and.returnValue(netStatObservable);
    mockSvc.getPods.and.returnValue(podsObservable);

    status = new BehaviorSubject<Status>({ type: StatusType.WARN, message: 'Memory usage is nearing capacity.' });
    mockStatusSvc = createMock(DeploymentStatusService);
    mockStatusSvc.getAggregateStatus.and.returnValue(status);
    mockStatusSvc.getCpuStatus.and.returnValue(Observable.of({ type: StatusType.OK, message: '' }));
    mockStatusSvc.getMemoryStatus.and.returnValue(Observable.of({ type: StatusType.WARN, message: 'Memory usage is nearing capacity.' }));
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
      { provide: DeploymentsService, useFactory: () => mockSvc },
      { provide: DeploymentStatusService, useFactory: () => mockStatusSvc },
      { provide: ChartDefaults, useValue: { getDefaultSparklineColor: () => ({}) } }
    ]
  });

  it('should correctly call deployments service functions with the correct arguments', function(this: Context) {
    expect(mockSvc.getPods).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getDeploymentCpuStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getDeploymentMemoryStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getDeploymentNetworkStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
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

  it('should set hasPods to false for state without pods', function(this: Context, done: DoneFn) {
    podsObservable.next({ total: 0, pods: [] });
    this.testedDirective.hasPods.subscribe((b: boolean) => {
      expect(b).toBeFalsy();
      done();
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
      expect(mockSvc.getDeploymentCpuStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
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

    it('should be set to OK (empty) class status', function(this: Context) {
      expect(this.testedDirective.cpuLabelClass).toEqual('');
      expect(this.testedDirective.cpuChartClass).toEqual('');
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
      expect(mockSvc.getDeploymentMemoryStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
      expect(de.componentInstance.dataMeasure).toEqual('GB');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(3);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(4);
    });

    it('should be set to WARN class status', function(this: Context) {
      expect(this.testedDirective.memLabelClass).toEqual('label-warn');
      expect(this.testedDirective.memChartClass).toEqual('chart-warn');
    });
  });

  describe('usage message', () => {
    it('should be an empty string when status is OK', function(this: Context) {
      status.next({ type: StatusType.OK, message: '' });
      this.detectChanges();
      expect(this.testedDirective.usageMessage).toEqual('');
    });

    it('should be "Nearing quota" when status is WARN', function(this: Context) {
      status.next({ type: StatusType.WARN, message: '' });
      this.detectChanges();
      expect(this.testedDirective.usageMessage).toEqual('Nearing quota');
    });

    it('should be "Reached quota" when status is WARN', function(this: Context) {
      status.next({ type: StatusType.ERR, message: '' });
      this.detectChanges();
      expect(this.testedDirective.usageMessage).toEqual('Reached quota');
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
      expect(mockSvc.getDeploymentNetworkStat).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
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

  describe('sparkline data', () => {
    it('should set CPU Y axis max to quota', function(this: Context) {
      expect(this.testedDirective.cpuConfig.axis.y.max).toEqual(2);
    });

    it('should set CPU Y axis max to maximum value or maximum quota', function(this: Context) {
      cpuStatObservable.next([
        {
          used: 1,
          quota: 100
        },
        {
          used: 2,
          quota: 200
        },
        {
          used: 150,
          quota: 200
        },
        {
          used: 75,
          quota: 100
        }
      ]);
      this.detectChanges();
      expect(this.testedDirective.cpuConfig.axis.y.max).toEqual(200);
    });

    it('should set Memory Y axis max to quota', function(this: Context) {
      expect(this.testedDirective.memConfig.axis.y.max).toEqual(4);
    });

    it('should set Memory Y axis max to maximum value or maximum quota', function(this: Context) {
      memStatObservable.next([
        {
          used: 1,
          quota: 100,
          units: 'MB'
        },
        {
          used: 2,
          quota: 200,
          units: 'MB'
        },
        {
          used: 150,
          quota: 200,
          units: 'MB'
        },
        {
          used: 75,
          quota: 100,
          units: 'MB'
        }
      ]);
      this.detectChanges();
      expect(this.testedDirective.memConfig.axis.y.max).toEqual(200);
    });
  });

  describe('linechart data', () => {
    it('should be rounded to whole numbers when units are bytes', function(this: Context) {
      const mb = Math.pow(1024, 2);
      netStatObservable.next([
        {
          sent: new ScaledNetworkStat(1 * mb, 1),
          received: new ScaledNetworkStat(2 * mb, 1)
        },
        {
          sent: new ScaledNetworkStat(100.567, 2),
          received: new ScaledNetworkStat(200.234, 2)
        }
      ] as NetworkStat[]);
      this.detectChanges();
      const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
      expect(detailsComponent.netVal).toEqual(301);
      expect(detailsComponent.netData.xData).toEqual(['time', 1, 2]);
      expect(detailsComponent.netData.yData.length).toEqual(2);
      expect(detailsComponent.netData.yData[0][2]).toEqual(101);
      expect(detailsComponent.netData.yData[1][2]).toEqual(200);
    });

    it('should be rounded to tenths when units are larger than bytes', function(this: Context) {
      const mb = Math.pow(1024, 2);
      netStatObservable.next([
        {
          sent: new ScaledNetworkStat(1 * mb, 1),
          received: new ScaledNetworkStat(2 * mb, 1)
        },
        {
          sent: new ScaledNetworkStat(12.34 * 1024, 2),
          received: new ScaledNetworkStat(45.67 * 1024, 2)
        }
      ] as NetworkStat[]);
      this.detectChanges();
      const detailsComponent: DeploymentDetailsComponent = this.testedDirective;
      expect(detailsComponent.netVal).toEqual(58);
      expect(detailsComponent.netData.xData).toEqual(['time', 1, 2]);
      expect(detailsComponent.netData.yData.length).toEqual(2);
      expect(detailsComponent.netData.yData[0][2]).toEqual(12636.2);
      expect(detailsComponent.netData.yData[1][2]).toEqual(46766.1);
    });
  });

});
