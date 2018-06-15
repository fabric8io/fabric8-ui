import {
  Component,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { createMock } from 'testing/mock';

import { Observable } from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { Stat } from '../models/stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { ResourceCardComponent } from './resource-card.component';

@Component({
  template: '<resource-card></resource-card>'
})
class HostComponent { }

@Component({
  selector: 'utilization-bar',
  template: ''
})
class FakeUtilizationBarComponent {
  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;
  @Input() status: Observable<Status>;
}

describe('ResourceCardComponent', () => {
  type Context = TestContext<ResourceCardComponent, HostComponent>;

  let mockResourceTitle: string = 'resource title';
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let mockStatusSvc: jasmine.SpyObj<DeploymentStatusService>;
  let cpuStatMock: Observable<CpuStat> = Observable.of({ used: 1, quota: 2 });
  let memoryStatMock: Observable<MemoryStat> = Observable.of({ used: 3, quota: 4, units: 'GB' as MemoryUnit  });

  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getApplications.and.returnValue(Observable.of(['foo-app', 'bar-app']));
    mockSvc.getEnvironments.and.returnValue(Observable.of(['stage', 'prod']));
    mockSvc.getEnvironmentCpuStat.and.returnValue(cpuStatMock);
    mockSvc.getEnvironmentMemoryStat.and.returnValue(memoryStatMock);

    mockStatusSvc = createMock(DeploymentStatusService);
    mockStatusSvc.getEnvironmentCpuStatus.and.returnValue(Observable.of({ type: StatusType.OK, message: '' }));
    mockStatusSvc.getEnvironmentMemoryStatus.and.returnValue(Observable.of({ type: StatusType.OK, message: '' }));
  });

  initContext(ResourceCardComponent, HostComponent,
    {
      declarations: [FakeUtilizationBarComponent],
      providers: [
        { provide: DeploymentsService, useFactory: () => mockSvc },
        { provide: DeploymentStatusService, useFactory: () => mockStatusSvc }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: ResourceCardComponent) => {
      component.spaceId = 'spaceId';
      component.environment = 'stage';
    }
  );


  it('should correctly request the deployed environment data', function(this: Context) {
    expect(mockSvc.getEnvironmentCpuStat).toHaveBeenCalledWith('spaceId', 'stage');
    expect(mockSvc.getEnvironmentMemoryStat).toHaveBeenCalledWith('spaceId', 'stage');
  });

  it('should have its children passed the proper values', function(this: Context) {
    let arrayOfComponents = this.fixture.debugElement.queryAll(By.directive(FakeUtilizationBarComponent));
    expect(arrayOfComponents.length).toEqual(2);

    let cpuUtilBar = arrayOfComponents[0].componentInstance;
    expect(cpuUtilBar.resourceTitle).toEqual('CPU');
    expect(cpuUtilBar.resourceUnit).toEqual('Cores');
    expect(cpuUtilBar.stat).toEqual(cpuStatMock);

    let memoryUtilBar = arrayOfComponents[1].componentInstance;
    expect(memoryUtilBar.resourceTitle).toEqual('Memory');
    expect(memoryUtilBar.resourceUnit).toEqual('GB');
    expect(memoryUtilBar.stat).toEqual(memoryStatMock);
  });
});
