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
import {
  initContext,
  TestContext
} from 'testing/test-context';

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
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

@Component({
  template: '<deployment-card></deployment-card>'
})
class HostComponent { }

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
  @Input() iconClass: string;
  @Input() toolTip: string;
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
  @Input() active: boolean;
}

function initMockSvc(): jasmine.SpyObj<DeploymentsService> {
  let mockSvc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);

  mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
  mockSvc.getDeploymentCpuStat.and.returnValue(Observable.of({ used: 1, quota: 2 }));
  mockSvc.getDeploymentMemoryStat.and.returnValue(Observable.of({ used: 3, quota: 4, units: 'GB' }));
  mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
  mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
  mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
  mockSvc.deleteApplication.and.returnValue(Observable.of('mockDeletedMessage'));

  return mockSvc;
}

describe('DeploymentCardComponent async tests', () => {

    let component: DeploymentCardComponent;
    let fixture: ComponentFixture<DeploymentCardComponent>;
    let mockSvc: jasmine.SpyObj<DeploymentsService>;
    let notifications: any;
    let active: Subject<boolean>;

    beforeEach(fakeAsync(() => {
      active = new BehaviorSubject<boolean>(true);
      mockSvc = initMockSvc();
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
        imports: [
          BsDropdownModule.forRoot(),
          CollapseModule.forRoot(),
          ChartModule ],
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

describe('DeploymentCardComponent', () => {
  type Context =  TestContext<DeploymentCardComponent, HostComponent>;
  let active: Subject<boolean>;
  let mockSvc: jasmine.SpyObj<DeploymentsService>;
  let notifications: any;
  let mockCpuData: Subject<CpuStat> = new BehaviorSubject({ used: 1, quota: 5 } as CpuStat);

  beforeEach(fakeAsync(() => {
    active = new BehaviorSubject<boolean>(true);
    mockSvc = initMockSvc();
    mockSvc.isApplicationDeployedInEnvironment.and.returnValue(active);
    mockSvc.getDeploymentCpuStat.and.returnValue(mockCpuData);
    notifications = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

    flush();
    flushMicrotasks();
  }));

  initContext(DeploymentCardComponent, HostComponent, {
    declarations: [
      DeploymentCardComponent,
      FakeDeploymentsDonutComponent,
      FakeDeploymentGraphLabelComponent,
      FakeDeploymentDetailsComponent,
      FakeDeploymentStatusIconComponent
    ],
    imports: [
      BsDropdownModule.forRoot(),
      CollapseModule.forRoot(),
      ChartModule ],
    providers: [
      BsDropdownConfig,
      { provide: NotificationsService, useFactory: () => notifications },
      { provide: DeploymentsService, useFactory: () => mockSvc }
    ]
  }, component => {
    component.spaceId = 'mockSpaceId';
    component.applicationId = 'mockAppId';
    component.environment = { name: 'mockEnvironment' } as Environment;
  });

  it('should be active', function(this: Context) {
    let detailsComponent = this.testedDirective;
    expect(detailsComponent.active).toBeTruthy();
  });

  describe('iconStatusLogic', () => {
    it('should set the button\'s initial value to ok', function(this: Context) {
      expect(this.testedDirective.iconClass).toBe(DeploymentStatusIconComponent.CLASSES.ICON_OK);
      expect(this.testedDirective.toolTip).toBe('Everything is ok.');
    });

    it('should change the button\'s value to warning if capacity changes', function(this: Context) {
      mockCpuData.next({ used: 4, quota: 5 } as CpuStat);
      this.detectChanges();
      expect(this.testedDirective.iconClass).toBe(DeploymentStatusIconComponent.CLASSES.ICON_WARN);
      expect(this.testedDirective.toolTip).toBe('CPU usage is nearing capacity.');
    });

    it('should change the button\s value to error if capacity is exceeded', function(this: Context) {
      mockCpuData.next({ used: 6, quota: 5 } as CpuStat);
      this.detectChanges();
      expect(this.testedDirective.iconClass).toBe(DeploymentStatusIconComponent.CLASSES.ICON_ERR);
      expect(this.testedDirective.toolTip).toBe('CPU usage has exceeded capacity.');
    });
  });


  describe('versionLabel', () => {
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(function(this: Context) {
      de = this.fixture.debugElement.query(By.css('#versionLabel'));
      el = de.nativeElement;
    });

    it('should be set from mockSvc.getVersion result', () => {
      expect(mockSvc.getVersion).toHaveBeenCalledWith('mockSpaceId', 'mockAppId', 'mockEnvironment');
      expect(el.textContent).toEqual('1.2.3');
    });
  });

  describe('inactive environment', () => {
    it('should not display', fakeAsync(function(this: Context) {
      active.next(false);
      this.detectChanges();

      expect(this.testedDirective.active).toBeFalsy();
    }));
  });
});
