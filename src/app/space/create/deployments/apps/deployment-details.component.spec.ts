import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  BehaviorSubject,
  Subject
} from 'rxjs';
import { of } from 'rxjs/observable/of';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledNetStat } from '../models/scaled-net-stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentDetailsComponent } from './deployment-details.component';

// Makes patternfly charts available
import { ChartDefaults } from 'patternfly-ng/chart';
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

interface ChartMock {
  axis: {
    max: jasmine.Spy
  };
  data: {
    colors: jasmine.Spy
  };
  destroy: jasmine.Spy;
  flush: jasmine.Spy;
}

describe('DeploymentDetailsComponent', () => {
  type Context = TestContext<DeploymentDetailsComponent, HostComponent>;
  let cpuChart: ChartMock;
  let memChart: ChartMock;
  let netChart: ChartMock;

  beforeEach(() => {
    cpuChart = {
      axis: {
        max: jasmine.createSpy('max')
      },
      data: {
        colors: jasmine.createSpy('colors')
      },
      destroy: jasmine.createSpy('destroy'),
      flush: jasmine.createSpy('flush')
    };
    memChart = {
      axis: {
        max: jasmine.createSpy('max')
      },
      data: {
        colors: jasmine.createSpy('colors')
      },
      destroy: jasmine.createSpy('destroy'),
      flush: jasmine.createSpy('flush')
    };
    netChart = {
      axis: {
        max: jasmine.createSpy('max')
      },
      data: {
        colors: jasmine.createSpy('colors')
      },
      destroy: jasmine.createSpy('destroy'),
      flush: jasmine.createSpy('flush')
    };
  });

  initContext(DeploymentDetailsComponent, HostComponent, {
    imports: [CollapseModule.forRoot()],
    declarations: [
      FakeDeploymentsDonutComponent,
      FakeDeploymentGraphLabelComponent
    ],
    providers: [
      {
        provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
          const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
          svc.getVersion.and.returnValue(of('1.2.3'));
          svc.getDeploymentCpuStat.and.returnValue(new BehaviorSubject([{ used: 1, quota: 2, timestamp: 1 }] as CpuStat[]));
          svc.getDeploymentMemoryStat.and.returnValue(new BehaviorSubject([{ used: 3, quota: 4, units: 'GB', timestamp: 1 }] as MemoryStat[]));
          svc.getAppUrl.and.returnValue(of('mockAppUrl'));
          svc.getConsoleUrl.and.returnValue(of('mockConsoleUrl'));
          svc.getLogsUrl.and.returnValue(of('mockLogsUrl'));
          svc.deleteDeployment.and.returnValue(of('mockDeletedMessage'));
          svc.getDeploymentNetworkStat.and.returnValue(
            new BehaviorSubject([{
              sent: new ScaledNetStat(1 * Math.pow(1024, 2), 1),
              received: new ScaledNetStat(2 * Math.pow(1024, 2), 1)
            }] as NetworkStat[])
          );
          svc.getPods.and.returnValue(
            new BehaviorSubject(
              { total: 1, pods: [['Running', 1], ['Starting', 0], ['Stopping', 0]] } as Pods
            )
          );
          return svc;
        }
      },
      {
        provide: DeploymentStatusService, useFactory: (): jasmine.SpyObj<DeploymentStatusService> => {
          const svc: jasmine.SpyObj<DeploymentStatusService> = createMock(DeploymentStatusService);
          svc.getDeploymentAggregateStatus.and.returnValue(new BehaviorSubject<Status>({ type: StatusType.WARN, message: 'Memory usage is nearing capacity.' }));
          svc.getDeploymentCpuStatus.and.returnValue(of({ type: StatusType.OK, message: '' }));
          svc.getDeploymentMemoryStatus.and.returnValue(of({ type: StatusType.WARN, message: 'Memory usage is nearing capacity.' }));
          return svc;
        }
      },
      { provide: ChartDefaults, useValue: { getDefaultSparklineColor: () => ({}) } }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  },
    (component: DeploymentDetailsComponent): void => {
      component.cpuChartLoaded(cpuChart as any);
      component.memChartLoaded(memChart as any);
      component.netChartLoaded(netChart as any);
    });

  it('should correctly call deployments service functions with the correct arguments', function(this: Context) {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

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
    TestBed.get(DeploymentsService).getPods().next({ total: 0, pods: [] });
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
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

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
      expect(cpuChart.data.colors).toHaveBeenCalledWith({ CPU: '#0088ce' });
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
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

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
      expect(memChart.data.colors).toHaveBeenCalledWith({ Memory: '#ec7a08' });
      expect(this.testedDirective.memLabelClass).toEqual('label-warn');
      expect(this.testedDirective.memChartClass).toEqual('chart-warn');
    });
  });

  describe('usage message', () => {
    it('should be an empty string when status is OK', function(this: Context) {
      const status: Subject<Status> = TestBed.get(DeploymentStatusService).getDeploymentAggregateStatus();

      status.next({ type: StatusType.OK, message: '' });
      expect(this.testedDirective.usageMessage).toEqual('');
    });

    it('should be "Nearing quota" when status is WARN', function(this: Context) {
      const status: Subject<Status> = TestBed.get(DeploymentStatusService).getDeploymentAggregateStatus();

      status.next({ type: StatusType.WARN, message: '' });
      expect(this.testedDirective.usageMessage).toEqual('Nearing quota');
    });

    it('should be "Reached quota" when status is WARN', function(this: Context) {
      const status: Subject<Status> = TestBed.get(DeploymentStatusService).getDeploymentAggregateStatus();

      status.next({ type: StatusType.ERR, message: '' });
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
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

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
      expect(cpuChart.axis.max).toHaveBeenCalledWith({ y: 2 });
    });

    it('should set CPU Y axis max to maximum value or maximum quota', function(this: Context) {
      TestBed.get(DeploymentsService).getDeploymentCpuStat().next([
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
      expect(cpuChart.axis.max).toHaveBeenCalledWith({ y: 200 });
    });

    it('should set Memory Y axis max to quota', function(this: Context) {
      expect(memChart.axis.max).toHaveBeenCalledWith({ y: 4 });
    });

    it('should set Memory Y axis max to maximum value or maximum quota', function(this: Context) {
      TestBed.get(DeploymentsService).getDeploymentMemoryStat().next([
        {
          used: 1,
          quota: 100,
          units: MemoryUnit.MB
        },
        {
          used: 2,
          quota: 200,
          units: MemoryUnit.MB
        },
        {
          used: 150,
          quota: 200,
          units: MemoryUnit.MB
        },
        {
          used: 75,
          quota: 100,
          units: MemoryUnit.MB
        }
      ]);
      expect(memChart.axis.max).toHaveBeenCalledWith({ y: 200 });
    });
  });

  describe('linechart data', () => {
    it('should be rounded to whole numbers when units are bytes', function(this: Context) {
      TestBed.get(DeploymentsService).getDeploymentNetworkStat().next([
        {
          sent: new ScaledNetStat(1 * Math.pow(1024, 2), 1),
          received: new ScaledNetStat(2 * Math.pow(1024, 2), 1)
        },
        {
          sent: new ScaledNetStat(100.567, 2),
          received: new ScaledNetStat(200.234, 2)
        }
      ] as NetworkStat[]);
      expect(this.testedDirective.netVal).toEqual(301);
      expect(this.testedDirective.netData.xData).toEqual(['time', 1, 2]);
      expect(this.testedDirective.netData.yData.length).toEqual(2);
      expect(this.testedDirective.netData.yData[0][2]).toEqual(101);
      expect(this.testedDirective.netData.yData[1][2]).toEqual(200);
    });

    it('should be rounded to tenths when units are larger than bytes', function(this: Context) {
      TestBed.get(DeploymentsService).getDeploymentNetworkStat().next([
        {
          sent: new ScaledNetStat(1 * Math.pow(1024, 2), 1),
          received: new ScaledNetStat(2 * Math.pow(1024, 2), 1)
        },
        {
          sent: new ScaledNetStat(12.34 * 1024, 2),
          received: new ScaledNetStat(45.67 * 1024, 2)
        }
      ] as NetworkStat[]);
      expect(this.testedDirective.netVal).toEqual(58);
      expect(this.testedDirective.netData.xData).toEqual(['time', 1, 2]);
      expect(this.testedDirective.netData.yData.length).toEqual(2);
      expect(this.testedDirective.netData.yData[0][2]).toEqual(12.3);
      expect(this.testedDirective.netData.yData[1][2]).toEqual(45.7);
      expect(this.testedDirective.netUnits).toEqual(MemoryUnit.KB);
    });
  });

});
