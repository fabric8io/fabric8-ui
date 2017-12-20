import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed
} from '@angular/core/testing';

import { createMock } from 'testing/mock';

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

import { NotificationsService } from 'app/shared/notifications.service';

import { DeploymentCardComponent } from './deployment-card.component';
import { DeploymentsService } from '../services/deployments.service';
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
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let notifications: any;

  beforeEach(fakeAsync(() => {
    mockSvc = createMock(DeploymentsService);
    mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
    mockSvc.getCpuStat.and.returnValue(Observable.of({ used: 1, quota: 2 }));
    mockSvc.getMemoryStat.and.returnValue(Observable.of({ used: 3, quota: 4, units: 'GB' }));
    mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
    mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
    mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
    mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));

    notifications = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

    TestBed.configureTestingModule({
      imports: [ BsDropdownModule.forRoot(), CollapseModule.forRoot(), ChartModule ],
      declarations: [ DeploymentCardComponent, FakeDeploymentsDonutComponent, FakeDeploymentGraphLabelComponent ],
      providers: [
        BsDropdownConfig,
        { provide: NotificationsService, useValue: notifications },
        { provide: DeploymentsService, useValue: mockSvc }
      ]
    });

    fixture = TestBed.createComponent(DeploymentCardComponent);
    component = fixture.componentInstance;

    component.spaceId = 'mockSpaceId';
    component.applicationId = 'mockAppId';
    component.environment = { name: 'mockEnvironment' } as Environment;

    fixture.detectChanges();
    flush();
    flushMicrotasks();
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

  describe('cpu label', () => {
    let de: DebugElement;

    beforeEach(() => {
      let charts = fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let cpuChart = charts[0];
      de = cpuChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should use units from service result', () => {
      expect(mockSvc.getMemoryStat).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
      expect(de.componentInstance.dataMeasure).toEqual('Cores');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(1);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(2);
    });
  });

  describe('memory label', () => {
    let de: DebugElement;

    beforeEach(() => {
      let charts = fixture.debugElement.queryAll(By.css('.deployment-chart'));
      let memoryChart = charts[1];
      de = memoryChart.query(By.directive(FakeDeploymentGraphLabelComponent));
    });

    it('should use units from service result', () => {
      expect(mockSvc.getMemoryStat).toHaveBeenCalledWith('mockAppId', 'mockEnvironment');
      expect(de.componentInstance.dataMeasure).toEqual('GB');
    });

    it('should use value from service result', () => {
      expect(de.componentInstance.value).toEqual(3);
    });

    it('should use upper bound from service result', () => {
      expect(de.componentInstance.valueUpperBound).toEqual(4);
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
      expect(notifications.message).toHaveBeenCalled();
    }));
  });

});
