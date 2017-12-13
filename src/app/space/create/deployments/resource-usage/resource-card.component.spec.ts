import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Component,
  Input
} from '@angular/core';

import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { Stat } from '../models/stat';

import { ResourceCardComponent } from './resource-card.component';

@Component({
  selector: 'utilization-bar',
  template: ''
})
class FakeUtilizationBarComponent {
  @Input() resourceTitle: string;
  @Input() stat: Observable<Stat>;
}

describe('ResourceCardComponent', () => {

  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;
  let mockResourceTitle = 'resource title';
  let mockSvc: DeploymentsService;
  let cpuStatMock = Observable.of({ used: 1, total: 2 } as CpuStat);
  let memoryStatMock = Observable.of({ used: 3, total: 4 } as MemoryStat);

  beforeEach(() => {
    mockSvc = {
      getApplications: () => Observable.of(['foo-app', 'bar-app']),
      getEnvironments: () => Observable.of([
        { environmentId: 'a1', name: 'stage' },
        { environmentId: 'b2', name: 'prod' }
      ]),
      getPods: () => { throw 'NotImplemented'; },
      scalePods: (spaceId: string, envId: string, appId: string) => { throw 'Not Implemented'; },
      getVersion: () => { throw 'NotImplemented'; },
      getCpuStat: (spaceId: string, envId: string) => cpuStatMock,
      getMemoryStat: (spaceId: string, envId: string) => memoryStatMock,
      getLogsUrl: () => { throw 'Not Implemented'; },
      getConsoleUrl: () => { throw 'Not Implemented'; },
      getAppUrl: () => { throw 'Not Implemented'; },
      deleteApplication: () => { throw 'Not Implemented'; }
    };

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'scalePods').and.callThrough();
    spyOn(mockSvc, 'getVersion').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();
    spyOn(mockSvc, 'getLogsUrl').and.callThrough();
    spyOn(mockSvc, 'getConsoleUrl').and.callThrough();
    spyOn(mockSvc, 'getAppUrl').and.callThrough();
    spyOn(mockSvc, 'deleteApplication').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [
        ResourceCardComponent,
        FakeUtilizationBarComponent
      ],
      providers: [{ provide: DeploymentsService, useValue: mockSvc }]
    });

    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;

    component.spaceId = 'spaceId';
    component.environmentId = 'environmentId';

    fixture.detectChanges();
  });

  it('should have its children passed the proper values', () => {
    let arrayOfComponents = fixture.debugElement.queryAll(By.directive(FakeUtilizationBarComponent));
    expect(arrayOfComponents.length).toEqual(2);

    let cpuUtilBar = arrayOfComponents[0].componentInstance;
    expect(cpuUtilBar.resourceTitle).toEqual('CPU (Cores)');
    expect(cpuUtilBar.stat).toEqual(cpuStatMock);

    let memoryUtilBar = arrayOfComponents[1].componentInstance;
    expect(memoryUtilBar.resourceTitle).toEqual('Memory (MB)');
    expect(memoryUtilBar.stat).toEqual(memoryStatMock);
  });

});
