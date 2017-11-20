import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DeploymentCardComponent } from './deployment-card.component';
import { DeploymentsService } from '../../services/deployments.service';
import { CpuStat } from '../../models/cpu-stat';
import { MemoryStat } from '../../models/memory-stat';

describe('DeploymentCardComponent', () => {

  let component: DeploymentCardComponent;
  let fixture: ComponentFixture<DeploymentCardComponent>;
  let mockSvc: DeploymentsService;

  beforeEach(() => {
    mockSvc = {
      getApplications: () => { throw 'Not Implemented'; },
      getEnvironments: () => { throw 'Not Implemented'; },
      getPodCount: () => Observable.of(2),
      getVersion: () => Observable.of('1.2.3'),
      getCpuStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as CpuStat),
      getMemoryStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as MemoryStat)
    };

    spyOn(mockSvc, 'getApplications').and.callThrough();
    spyOn(mockSvc, 'getEnvironments').and.callThrough();
    spyOn(mockSvc, 'getPodCount').and.callThrough();
    spyOn(mockSvc, 'getCpuStat').and.callThrough();
    spyOn(mockSvc, 'getMemoryStat').and.callThrough();
    spyOn(mockSvc, 'getVersion').and.callThrough();

    TestBed.configureTestingModule({
      imports: [ CollapseModule.forRoot() ],
      declarations: [ DeploymentCardComponent ],
      providers: [ { provide: DeploymentsService, useValue: mockSvc } ]
    });

    fixture = TestBed.createComponent(DeploymentCardComponent);
    component = fixture.componentInstance;

    component.applicationId = 'mockAppId';
    component.environment = { environmentId: 'mockEnvironmentId', name: 'mockEnvironment'};

    fixture.detectChanges();

    it('should generate a unique chartid for each DeploymentCardComponent instance', () => {
      let depCard1 = new DeploymentCardComponent(null);
      let depCard2 = new DeploymentCardComponent(null);
      let depCard3 = new DeploymentCardComponent(null);

      expect(depCard1.config.chartId !== depCard2.config.chartId !== depCard3.config.chartId);
    });
  });

  describe('podCountLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#podCountLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getPodCount result', () => {
      expect(mockSvc.getPodCount).toHaveBeenCalledWith('mockAppId', 'mockEnvironmentId');
      expect(el.textContent).toEqual('2 Pods');
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
