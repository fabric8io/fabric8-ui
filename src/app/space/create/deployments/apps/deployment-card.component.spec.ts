import {
  Component,
  DebugElement,
  Input
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import {
  BsDropdownConfig,
  BsDropdownModule,
  BsDropdownToggleDirective
} from 'ngx-bootstrap/dropdown';
import { ChartModule } from 'patternfly-ng';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';
import { createMock } from 'testing/mock';

import { NotificationsService } from 'app/shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentCardComponent } from './deployment-card.component';

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

@Component({
  selector: 'deployment-status-icon',
  template: ''
})
class FakeDeploymentStatusIconComponent {
  @Input() cpuDataStream: Observable<CpuStat>;
}

@Component({
  selector: 'deployment-details',
  template: ''
})
class FakeDeploymentDetailsComponent {
  @Input() collapsed: boolean;
  @Input() applicationId: string;
  @Input() environment: Environment;
  @Input() spaceId: string;
}

describe('DeploymentCardComponent', () => {

  let component: DeploymentCardComponent;
  let fixture: ComponentFixture<DeploymentCardComponent>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let notifications: any;
  let active: Subject<boolean>;

  beforeEach(fakeAsync(() => {
    active = new BehaviorSubject<boolean>(true);

    mockSvc = createMock(DeploymentsService);
    mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
    mockSvc.getCpuStat.and.returnValue(Observable.of({ used: 1, quota: 2 }));
    mockSvc.getMemoryStat.and.returnValue(Observable.of({ used: 3, quota: 4, units: 'GB' }));
    mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
    mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
    mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
    mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));
    mockSvc.isApplicationDeployedInEnvironment.and.returnValue(active);

    notifications = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

    TestBed.configureTestingModule({
      declarations: [
        DeploymentCardComponent,
        FakeDeploymentsDonutComponent,
        FakeDeploymentGraphLabelComponent,
        FakeDeploymentDetailsComponent,
        FakeDeploymentStatusIconComponent
      ],
      imports: [ BsDropdownModule.forRoot(), CollapseModule.forRoot(), ChartModule ],
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

  it('should be active', () => {
    expect(component.active).toBeTruthy();
  });

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

  describe('inactive environment', () => {
    it('should not display', fakeAsync(() => {
      active.next(false);
      fixture.detectChanges();

      expect(component.active).toBeFalsy();
    }));
  });
});
