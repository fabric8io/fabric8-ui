import {
  Component,
  DebugElement,
  Input,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext } from 'testing/test-context';

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

  const testContext = initContext(ResourceCardComponent, HostComponent,
    {
      declarations: [FakeUtilizationBarComponent],
      providers: [
        {
          provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
            svc.getApplications.and.returnValue(of(['foo-app', 'bar-app']));
            svc.getEnvironments.and.returnValue(of(['stage', 'prod']));
            svc.getEnvironmentCpuStat.and.returnValue(of({ used: 1, quota: 2 }));
            svc.getEnvironmentMemoryStat.and.returnValue(of({ used: 3, quota: 4, units: MemoryUnit.GB }));
            return svc;
          }
        },
        {
          provide: DeploymentStatusService, useFactory: (): jasmine.SpyObj<DeploymentStatusService> => {
            const svc: jasmine.SpyObj<DeploymentStatusService> = createMock(DeploymentStatusService);
            svc.getEnvironmentCpuStatus.and.returnValue(of({ type: StatusType.OK, message: '' }));
            svc.getEnvironmentMemoryStatus.and.returnValue(of({ type: StatusType.OK, message: '' }));
            return svc;
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    },
    (component: ResourceCardComponent): void => {
      component.spaceId = 'spaceId';
      component.environment = 'stage';
    }
  );

  it('should correctly request the deployed environment data', (): void => {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
    expect(mockSvc.getEnvironmentCpuStat).toHaveBeenCalledWith('spaceId', 'stage');
    expect(mockSvc.getEnvironmentMemoryStat).toHaveBeenCalledWith('spaceId', 'stage');
  });

  it('should have its children passed the proper values', (): void => {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
    const arrayOfComponents: DebugElement[] = testContext.fixture.debugElement.queryAll(By.directive(FakeUtilizationBarComponent));
    expect(arrayOfComponents.length).toEqual(2);

    const cpuUtilBar: FakeUtilizationBarComponent = arrayOfComponents[0].componentInstance;
    expect(cpuUtilBar.resourceTitle).toEqual('CPU');
    expect(cpuUtilBar.resourceUnit).toEqual('Cores');
    expect(cpuUtilBar.stat).toEqual(mockSvc.getEnvironmentCpuStat());

    const memoryUtilBar: FakeUtilizationBarComponent = arrayOfComponents[1].componentInstance;
    expect(memoryUtilBar.resourceTitle).toEqual('Memory');
    expect(memoryUtilBar.resourceUnit).toEqual('GB');
    expect(memoryUtilBar.stat).toEqual(mockSvc.getEnvironmentMemoryStat());
  });
});
