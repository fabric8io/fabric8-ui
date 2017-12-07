import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DeploymentsComponent } from './deployments.component';
import { DeploymentsService } from './services/deployments.service';
import { CpuStat } from './models/cpu-stat';
import { Environment } from './models/environment';
import { MemoryStat } from './models/memory-stat';
import { Stat } from './models/stat';

import { Spaces } from 'ngx-fabric8-wit';

@Component({
  selector: 'deployment-card',
  template: ''
})
class FakeDeploymentCardComponent {
  @Input() applicationId: string;
  @Input() environment: Environment;
}

@Component({
  selector: 'deployments-resource-usage',
  template: ''
})
class FakeDeploymentsResourceUsageComponent {
  @Input() environments: Observable<Environment[]>;
}

describe('DeploymentsComponent', () => {

  let component: DeploymentsComponent;
  let fixture: ComponentFixture<DeploymentsComponent>;
  let mockSvc: DeploymentsService;
  let spaces: Spaces;
  let mockEnvironments = Observable.of([
    { environmentId: 'a1', name: 'stage' },
    { environmentId: 'b2', name: 'prod' }
  ]);

  beforeEach(() => {
    mockSvc = {
      getApplications: () => Observable.of(['foo-app', 'bar-app']),
      getEnvironments: () => mockEnvironments,
      getPodCount: () => { throw 'Not Implemented'; },
      getVersion: () => { throw 'NotImplemented'; },
      getCpuStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as CpuStat),
      getMemoryStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as MemoryStat)
    };

    spaces = {
      current: Observable.of({ id: 'fake-spaceId' })
    } as Spaces;

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPodCount').and.callThrough();
    spyOn(mockSvc, 'getVersion').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [
        DeploymentsComponent,
        FakeDeploymentCardComponent,
        FakeDeploymentsResourceUsageComponent
      ],
      providers: [
        { provide: DeploymentsService, useValue: mockSvc },
        { provide: Spaces, useValue: spaces }
      ]
    });

    fixture = TestBed.createComponent(DeploymentsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should set service result to applications property', (done: DoneFn) => {
    expect(mockSvc.getApplications).toHaveBeenCalledWith('fake-spaceId');
    component.applications.subscribe(applications => {
      expect(applications).toEqual(['foo-app', 'bar-app']);
      done();
    });
  });

  it('should set service result to environments property', (done: DoneFn) => {
    expect(mockSvc.getEnvironments).toHaveBeenCalledWith('fake-spaceId');
    component.environments.subscribe(environments => {
      expect(environments).toEqual([
        { environmentId: 'a1', name: 'stage' },
        { environmentId: 'b2', name: 'prod' }
      ]);
      done();
    });
  });

  it('should pass values to children resource usage components', () => {
    let resourceUsageComponents = fixture.debugElement.queryAll(By.directive(FakeDeploymentsResourceUsageComponent));
    expect(resourceUsageComponents.length).toEqual(1);

    let resourceUsageComponent = resourceUsageComponents[0].componentInstance;
    expect(resourceUsageComponent.environments).toEqual(mockEnvironments);
  });

});
