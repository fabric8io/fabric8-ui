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

import { DeploymentCardComponent } from './deployment-card.component';
import { DeploymentsService } from '../services/deployments.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

// Makes patternfly charts available
import { ChartModule } from 'patternfly-ng';
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  selector: 'deployments-donut',
  template: ''
})
class FakeDeploymentsDonutComponent {
  @Input() mini: boolean;
  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environmentId: string;
}

describe('DeploymentCardComponent', () => {

  let component: DeploymentCardComponent;
  let fixture: ComponentFixture<DeploymentCardComponent>;
  let mockSvc: DeploymentsService;

  beforeEach(() => {
    mockSvc = {
      getApplications: () => { throw 'Not Implemented'; },
      getEnvironments: () => { throw 'Not Implemented'; },
      getPods: (spaceId: string, applicationId: string, environmentId: string) => { throw 'NotImplemented'; },
      getVersion: () => Observable.of('1.2.3'),
      getCpuStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as CpuStat),
      getMemoryStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as MemoryStat),
      getAppUrl: () => Observable.of('mockAppUrl'),
      getConsoleUrl: () => Observable.of('mockConsoleUrl'),
      getLogsUrl: () => Observable.of('mockLogsUrl'),
      deleteApplication: () => Observable.of('mockDeletedMessage')
    };

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPods').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();
    spyOn(mockSvc, 'getVersion').and.callThrough();
    spyOn(mockSvc, 'getAppUrl').and.callThrough();
    spyOn(mockSvc, 'getConsoleUrl').and.callThrough();
    spyOn(mockSvc, 'getLogsUrl').and.callThrough();
    spyOn(mockSvc, 'deleteApplication').and.callThrough();

    TestBed.configureTestingModule({
      imports: [CollapseModule.forRoot(), ChartModule],
      declarations: [DeploymentCardComponent, FakeDeploymentsDonutComponent],
      providers: [{ provide: DeploymentsService, useValue: mockSvc }]
    });

    fixture = TestBed.createComponent(DeploymentCardComponent);
    component = fixture.componentInstance;

    component.applicationId = 'mockAppId';
    component.environment = { environmentId: 'mockEnvironmentId', name: 'mockEnvironment' };

    fixture.detectChanges();

    it('should generate a unique chartid for each DeploymentCardComponent instance', () => {
      let depCard1 = new DeploymentCardComponent(null);
      let depCard2 = new DeploymentCardComponent(null);
      let depCard3 = new DeploymentCardComponent(null);

      expect(depCard1.getChartIdNum()).not.toBe(depCard2.getChartIdNum());
      expect(depCard1.getChartIdNum()).not.toBe(depCard3.getChartIdNum());
      expect(depCard2.getChartIdNum()).not.toBe(depCard3.getChartIdNum());
    });
  });

  describe('versionLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#versionLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getVersion result', () => {
      expect(mockSvc.getVersion).toHaveBeenCalledWith('mockAppId', 'mockEnvironmentId');
      expect(el.textContent).toEqual('1.2.3');
    });
  });

});
