import {
  Component,
  Input
} from '@angular/core';

import { By } from '@angular/platform-browser';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { createMock } from 'testing/mock';

import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';

import { Environment } from '../models/environment';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { Stat } from '../models/stat';

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

describe('ResourceCardComponent', () => {
  type Context = TestContext<ResourceCardComponent, HostComponent>;

  let mockResourceTitle = 'resource title';
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let cpuStatMock = Observable.of({ used: 1, quota: 2 } as CpuStat);
  let memoryStatMock = Observable.of({ used: 3, quota: 4, units: 'GB' } as MemoryStat);

  beforeEach(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getApplications.and.returnValue(Observable.of(['foo-app', 'bar-app']));
    mockSvc.getEnvironments.and.returnValue(Observable.of([
      { name: 'stage' } as Environment,
      { name: 'prod' } as Environment
    ]));
    mockSvc.getCpuStat.and.returnValue(cpuStatMock);
    mockSvc.getMemoryStat.and.returnValue(memoryStatMock);
  });

  initContext(ResourceCardComponent, HostComponent, {
    declarations: [FakeUtilizationBarComponent],
    providers: [{ provide: DeploymentsService, useFactory: () => mockSvc }]
  },
    component => {
      component.spaceId = 'spaceId';
      component.environment = { name: 'stage' } as Environment;
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
