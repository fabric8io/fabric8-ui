import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import {
  BsDropdownConfig,
  BsDropdownModule,
  BsDropdownToggleDirective
} from 'ngx-bootstrap/dropdown';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

import { ChartModule } from 'patternfly-ng/chart';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';
import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentCardComponent } from './deployment-card.component';

@Component({
  template: '<deployment-card></deployment-card>'
})
class HostComponent { }

@Component({
  selector: 'delete-deployment-modal',
  template: ''
})
class FakeDeleteDeploymentModal {
  @Input() host: ModalDirective;
  @Input() applicationId: string;
  @Input() environmentName: string;
  @Output() deleteEvent = new EventEmitter();
}

function initMockSvc(): jasmine.SpyObj<DeploymentsService> {
  const mockSvc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);

  mockSvc.getVersion.and.returnValue(Observable.of('1.2.3'));
  mockSvc.getDeploymentCpuStat.and.returnValue(Observable.of([{ used: 1, quota: 2, timestamp: 1 }] as CpuStat[]));
  mockSvc.getDeploymentMemoryStat.and.returnValue(Observable.of([{ used: 3, quota: 4, units: 'GB', timestamp: 1 }] as MemoryStat[]));
  mockSvc.getAppUrl.and.returnValue(Observable.of('mockAppUrl'));
  mockSvc.getConsoleUrl.and.returnValue(Observable.of('mockConsoleUrl'));
  mockSvc.getLogsUrl.and.returnValue(Observable.of('mockLogsUrl'));
  mockSvc.deleteDeployment.and.returnValue(Observable.of('mockDeletedMessage'));
  mockSvc.isApplicationDeployedInEnvironment.and.returnValue(new BehaviorSubject<boolean>(true));

  return mockSvc;
}

describe('DeploymentCardComponent async tests', () => {
  type Context = TestContext<DeploymentCardComponent, HostComponent>;

  initContext(DeploymentCardComponent, HostComponent, {
    declarations: [FakeDeleteDeploymentModal],
    imports: [
      BsDropdownModule.forRoot(),
      CollapseModule.forRoot(),
      ChartModule,
      ModalModule.forRoot()
    ],
    providers: [
      BsDropdownConfig,
      { provide: NotificationsService, useFactory: () => jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']) },
      { provide: DeploymentsService, useFactory: () => initMockSvc() },
      {
        provide: DeploymentStatusService, useFactory: (): jasmine.SpyObj<DeploymentStatusService> => {
          const svc: jasmine.SpyObj<DeploymentStatusService> = createMock(DeploymentStatusService);
          svc.getDeploymentAggregateStatus.and.returnValue(Observable.never());
          return svc;
        }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  },
    (component: DeploymentCardComponent) => {
      component.spaceId = 'mockSpaceId';
      component.applicationId = 'mockAppId';
      component.environment = 'mockEnvironment';
    });

  describe('dropdown menus', () => {
    let menuItems: DebugElement[];

    function getItemByLabel(label: string): DebugElement {
      return menuItems
        .filter((item: DebugElement) => item.nativeElement.textContent.includes(label))[0];
    }

    beforeEach(fakeAsync(function(this: Context) {
      const de: DebugElement = this.fixture.debugElement.query(By.directive(BsDropdownToggleDirective));
      de.triggerEventHandler('click', new CustomEvent('click'));

      this.fixture.detectChanges();
      tick();

      const menu: DebugElement = this.fixture.debugElement.query(By.css('.dropdown-menu'));
      menuItems = menu.queryAll(By.css('li'));
    }));

    it('should not display appUrl if none available', fakeAsync(function(this: Context) {
      this.testedDirective.appUrl = Observable.of('');

      this.fixture.detectChanges();

      const menu: DebugElement = this.fixture.debugElement.query(By.css('.dropdown-menu'));
      menuItems = menu.queryAll(By.css('li'));
      const item: DebugElement = getItemByLabel('Open Application');
      expect(item).toBeFalsy();
    }));

    it('should call the delete modal open method', fakeAsync(function(this: Context) {
      spyOn(this.testedDirective, 'openModal');

      const item: DebugElement = getItemByLabel('Delete');
      expect(item).toBeTruthy();
      item.query(By.css('a')).triggerEventHandler('click', new CustomEvent('click'));
      this.fixture.detectChanges();

      expect(this.testedDirective.openModal).toHaveBeenCalled();
    }));

    it('should call the delete service method when the modal event fires', fakeAsync(function(this: Context) {
      const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
      const de: DebugElement = this.fixture.debugElement.query(By.directive(FakeDeleteDeploymentModal));
      expect(mockSvc.deleteDeployment).not.toHaveBeenCalled();
      de.componentInstance.deleteEvent.emit();
      expect(mockSvc.deleteDeployment).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    }));

  });

  it('should not display inactive environments', fakeAsync(function(this: Context) {
    expect(this.testedDirective.active).toBeTruthy();

    TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment().next(false);
    this.fixture.detectChanges();

    expect(this.testedDirective.active).toBeFalsy();
  }));
});

describe('DeploymentCardComponent', () => {
  type Context = TestContext<DeploymentCardComponent, HostComponent>;

  initContext(DeploymentCardComponent, HostComponent, {
    declarations: [FakeDeleteDeploymentModal],
    imports: [
      BsDropdownModule.forRoot(),
      CollapseModule.forRoot(),
      ChartModule,
      ModalModule.forRoot()
    ],
    providers: [
      BsDropdownConfig,
      { provide: NotificationsService, useFactory: () => jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']) },
      {
        provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
          const svc: jasmine.SpyObj<DeploymentsService> = initMockSvc();
          svc.getDeploymentCpuStat.and.returnValue(new BehaviorSubject([{ used: 1, quota: 5, timestamp: 1 }] as CpuStat[]));
          svc.getDeploymentMemoryStat.and.returnValue(new BehaviorSubject([{ used: 1, quota: 5, timestamp: 1 }] as MemoryStat[]));
          svc.deleteDeployment.and.returnValue(new Subject<string>());
          return svc;
        }
      },
      {
        provide: DeploymentStatusService, useFactory: (): jasmine.SpyObj<DeploymentStatusService> => {
          const svc: jasmine.SpyObj<DeploymentStatusService> = createMock(DeploymentStatusService);
          svc.getDeploymentAggregateStatus.and.returnValue(new BehaviorSubject({ type: StatusType.WARN, message: 'warning message' }));
          return svc;
        }
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  },
    (component: DeploymentCardComponent) => {
      component.spaceId = 'mockSpaceId';
      component.applicationId = 'mockAppId';
      component.environment = 'mockEnvironment';
    });

  it('should be active', function(this: Context) {
    let detailsComponent = this.testedDirective;
    expect(detailsComponent.active).toBeTruthy();
  });

  describe('#delete', () => {
    it('should clear "deleting" flag when request completes successfully', function(this: Context) {
      const deleting: Subject<string> = TestBed.get(DeploymentsService).deleteDeployment();

      expect(this.testedDirective.active).toBeTruthy();
      expect(this.testedDirective.deleting).toBeFalsy();

      this.testedDirective.delete();
      expect(this.testedDirective.active).toBeTruthy();
      expect(this.testedDirective.deleting).toBeTruthy();

      deleting.next('delete success');
      expect(this.testedDirective.active).toBeFalsy();
      expect(this.testedDirective.deleting).toBeFalsy();
    });

    it('should clear "deleting" flag when request completes with error', function(this: Context) {
      const deleting: Subject<string> = TestBed.get(DeploymentsService).deleteDeployment();

      expect(this.testedDirective.active).toBeTruthy();
      expect(this.testedDirective.deleting).toBeFalsy();

      this.testedDirective.delete();
      expect(this.testedDirective.active).toBeTruthy();
      expect(this.testedDirective.deleting).toBeTruthy();

      deleting.error('delete failure');
      expect(this.testedDirective.active).toBeTruthy();
      expect(this.testedDirective.deleting).toBeFalsy();
    });
  });

  it('should set versionLabel from mockSvc.getVersion result', function(this: Context) {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

    let de: DebugElement = this.fixture.debugElement.query(By.css('#versionLabel'));
    let el: HTMLElement = de.nativeElement;
    expect(mockSvc.getVersion).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(el.textContent).toEqual('1.2.3');
  });

  it('should invoke deployments service calls with the correct arguments', function(this: Context) {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

    expect(mockSvc.isApplicationDeployedInEnvironment).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getLogsUrl).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getConsoleUrl).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getAppUrl).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
  });

  it('should not display inactive environments', fakeAsync(function(this: Context) {
    expect(this.testedDirective.active).toBeTruthy();

    TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment().next(false);
    this.detectChanges();

    expect(this.testedDirective.active).toBeFalsy();
  }));

  it('should set icon status from DeploymentStatusService aggregate', function(this: Context) {
    const mockStatusSvc: jasmine.SpyObj<DeploymentStatusService> = TestBed.get(DeploymentStatusService);
    const mockStatus: Subject<Status> = mockStatusSvc.getDeploymentAggregateStatus();

    expect(mockStatusSvc.getDeploymentAggregateStatus).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(this.testedDirective.toolTip).toEqual('warning message');
    expect(this.testedDirective.iconClass).toEqual('pficon-warning-triangle-o');
    expect(this.testedDirective.cardStatusClass).toEqual('status-ribbon-warn');

    mockStatus.next({ type: StatusType.ERR, message: 'error message' });
    expect(this.testedDirective.toolTip).toEqual('error message');
    expect(this.testedDirective.iconClass).toEqual('pficon-error-circle-o');
    expect(this.testedDirective.cardStatusClass).toEqual('status-ribbon-err');

    mockStatus.next({ type: StatusType.OK, message: '' });
    expect(this.testedDirective.toolTip).toEqual(DeploymentCardComponent.OK_TOOLTIP);
    expect(this.testedDirective.iconClass).toEqual('pficon-ok');
    expect(this.testedDirective.cardStatusClass).toEqual('');
  });
});
