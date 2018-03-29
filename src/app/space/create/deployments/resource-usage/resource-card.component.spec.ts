import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { createMock } from 'testing/mock';

import { Observable } from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import {
  MemoryStat,
  MemoryUnit
} from '../models/memory-stat';
import { Stat } from '../models/stat';
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
}

@Component({
  selector: 'loading-utilization-bar',
  template: ''
})
class FakeLoadingUtilizationBarComponent {
  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
}


describe('ResourceCardComponent', () => {
  type Context = TestContext<ResourceCardComponent, HostComponent>;

  let mockResourceTitle: string = 'resource title';
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let cpuStatMock: Observable<CpuStat> = Observable.of({ used: 1, quota: 2 });
  let memoryStatMock: Observable<MemoryStat> = Observable.of({ used: 3, quota: 4, units: 'GB' as MemoryUnit  });

  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getApplications.and.returnValue(Observable.of(['foo-app', 'bar-app']));
    mockSvc.getEnvironments.and.returnValue(Observable.of(['stage', 'prod']));
    mockSvc.getEnvironmentCpuStat.and.returnValue(cpuStatMock);
    mockSvc.getEnvironmentMemoryStat.and.returnValue(memoryStatMock);
  });

  initContext(ResourceCardComponent, HostComponent,
    {
      declarations: [FakeUtilizationBarComponent, FakeLoadingUtilizationBarComponent],
      providers: [{ provide: DeploymentsService, useFactory: () => mockSvc }]
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
