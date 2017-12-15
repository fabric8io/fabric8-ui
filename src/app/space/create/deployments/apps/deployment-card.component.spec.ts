import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement,
  Input
} from '@angular/core';

import { Observable } from 'rxjs';

import {
  BsDropdownConfig,
  BsDropdownModule,
  BsDropdownToggleDirective
} from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DeploymentCardComponent } from './deployment-card.component';
import { DeploymentsService } from '../services/deployments.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { Environment } from '../models/environment';

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
  @Input() environment: Environment;
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

describe('DeploymentCardComponent', () => {

  let component: DeploymentCardComponent;
  let fixture: ComponentFixture<DeploymentCardComponent>;
  let mockSvc: DeploymentsService;

  beforeEach(fakeAsync(() => {
    mockSvc = {
      getApplications: () => { throw 'Not Implemented'; },
      getEnvironments: () => { throw 'Not Implemented'; },
      getPods: (spaceId: string, applicationId: string, environmentId: string) => { throw 'NotImplemented'; },
      scalePods: (spaceId: string, appId: string, envId: string, desired: number) => { throw 'NotImplemented'; },
      getVersion: () => Observable.of('1.2.3'),
      getCpuStat: (spaceId: string, envId: string) => Observable.of({ used: 1, total: 2 } as CpuStat),
      getMemoryStat: (spaceId: string, envId: string) =>
        Observable.of({ used: 1, total: 2, units: 'GB' } as MemoryStat),
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
      imports: [ BsDropdownModule.forRoot(), CollapseModule.forRoot(), ChartModule ],
      declarations: [ DeploymentCardComponent, FakeDeploymentsDonutComponent, FakeDeploymentGraphLabelComponent ],
      providers: [ BsDropdownConfig, { provide: DeploymentsService, useValue: mockSvc } ]
    });

    fixture = TestBed.createComponent(DeploymentCardComponent);
    component = fixture.componentInstance;

    component.spaceId = 'mockSpaceId';
    component.applicationId = 'mockAppId';
    component.environment = { environmentId: 'mockEnvironmentId', name: 'mockEnvironment' };

    fixture.detectChanges();
    flush();
    flushMicrotasks();

    it('should generate a unique chartid for each DeploymentCardComponent instance', () => {
      let depCard1 = new DeploymentCardComponent(null);
      let depCard2 = new DeploymentCardComponent(null);
      let depCard3 = new DeploymentCardComponent(null);

      expect(depCard1.getChartIdNum()).not.toBe(depCard2.getChartIdNum());
      expect(depCard1.getChartIdNum()).not.toBe(depCard3.getChartIdNum());
      expect(depCard2.getChartIdNum()).not.toBe(depCard3.getChartIdNum());
    });
  }));

  describe('versionLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(() => {
      de = fixture.debugElement.query(By.css('#versionLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getVersion result', () => {
      expect(mockSvc.getVersion).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
      expect(el.textContent).toEqual('1.2.3');
    });
  });

  describe('memory label', () => {
    let de: DebugElement;

    beforeEach(() => {
      let charts = fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let memoryChart = charts[1];
      de = charts[1].query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should use units from service result', () => {
      expect(mockSvc.getMemoryStat).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
      expect(de.componentInstance.dataMeasure).toEqual('GB');
    });
  });

  describe('dropdown menus', () => {
    let menuItems: DebugElement[];

    function getItemByLabel(label: string): DebugElement {
      return menuItems
        .filter(item => item.nativeElement.textContent.includes(label))[0];
    }

    beforeEach(fakeAsync(() => {
      let de = fixture.debugElement.query(By.directive(BsDropdownToggleDirective));
      de.triggerEventHandler('click', null);

      fixture.detectChanges();

      let menu = fixture.debugElement.query(By.css('.dropdown-menu'));
      menuItems = menu.queryAll(By.css('li'));
    }));

    it('should have menu items', () => {
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should link to fake logsUrl on \'View logs\'', () => {
      let item = getItemByLabel('View logs');
      expect(item).toBeTruthy();
      let link = item.query(By.css('a'));
      expect(link.attributes['target']).toEqual('_blank');
      expect(link.attributes['href']).toEqual('mockLogsUrl');
    });

    it('should link to fake consoleUrl on \'View OpenShift Console\'', () => {
      let item = getItemByLabel('View OpenShift Console');
      expect(item).toBeTruthy();
      let link = item.query(By.css('a'));
      expect(link.attributes['target']).toEqual('_blank');
      expect(link.attributes['href']).toEqual('mockConsoleUrl');
    });

    it('should link to fake appUrl on \'Open Application\'', () => {
      let item = getItemByLabel('Open Application');
      expect(item).toBeTruthy();
      let link = item.query(By.css('a'));
      expect(link.attributes['target']).toEqual('_blank');
      expect(link.attributes['href']).toEqual('mockAppUrl');
    });

    it('should not display appUrl if none available', fakeAsync(() => {
      component.appUrl = Observable.of('');

      fixture.detectChanges();

      let menu = fixture.debugElement.query(By.css('.dropdown-menu'));
      menuItems = menu.queryAll(By.css('li'));
      let item = getItemByLabel('Open Application');
      expect(item).toBeFalsy();
    }));

    it('should invoke service \'delete\' function on Delete item click', fakeAsync(() => {
      let item = getItemByLabel('Delete');
      expect(item).toBeTruthy();
      expect(mockSvc.deleteApplication).not.toHaveBeenCalled();
      item.query(By.css('a')).triggerEventHandler('click', null);

      fixture.detectChanges();

      expect(mockSvc.deleteApplication).toHaveBeenCalled();
    }));
  });

});
