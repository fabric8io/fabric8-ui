import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {
  BsDropdownConfig,
  BsDropdownModule,
  BsDropdownToggleDirective,
} from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import 'patternfly/dist/js/patternfly-settings.js';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext } from 'testing/test-context';
import { NotificationsService } from '../../../../shared/notifications.service';
import { DeploymentStatusService, Status, StatusType } from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentCardComponent } from './deployment-card.component';

@Component({
  template: '<deployment-card></deployment-card>',
})
class HostComponent {}

@Component({
  selector: 'delete-deployment-modal',
  template: '',
})
class FakeDeleteDeploymentModal {
  @Input() applicationId: string;
  @Input() environmentName: string;
  @Output() deleteEvent = new EventEmitter();
}

describe('DeploymentCardComponent', () => {
  const testContext = initContext(
    DeploymentCardComponent,
    HostComponent,
    {
      declarations: [FakeDeleteDeploymentModal],
      imports: [BsDropdownModule.forRoot(), CollapseModule.forRoot(), ModalModule.forRoot()],
      providers: [
        BsDropdownConfig,
        {
          provide: NotificationsService,
          useFactory: () =>
            jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']),
        },
        {
          provide: DeploymentsService,
          useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);

            svc.getVersion.and.returnValue(of('1.2.3'));
            svc.getDeploymentCpuStat.and.returnValue(of([{ used: 1, quota: 2, timestamp: 1 }]));
            svc.getDeploymentMemoryStat.and.returnValue(
              of([{ used: 3, quota: 4, units: 'GB', timestamp: 1 }]),
            );
            svc.getAppUrl.and.returnValue(of('mockAppUrl'));
            svc.getConsoleUrl.and.returnValue(of('mockConsoleUrl'));
            svc.getLogsUrl.and.returnValue(of('mockLogsUrl'));
            svc.deleteDeployment.and.returnValue(of('mockDeletedMessage'));
            svc.isApplicationDeployedInEnvironment.and.returnValue(
              new BehaviorSubject<boolean>(true),
            );
            svc.deleteDeployment.and.returnValue(new Subject<string>());

            return svc;
          },
        },
        {
          provide: DeploymentStatusService,
          useFactory: (): jasmine.SpyObj<DeploymentStatusService> => {
            const svc: jasmine.SpyObj<DeploymentStatusService> = createMock(
              DeploymentStatusService,
            );
            svc.getDeploymentAggregateStatus.and.returnValue(
              new BehaviorSubject({ type: StatusType.WARN, message: 'warning message' }),
            );
            return svc;
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    },
    (component: DeploymentCardComponent): void => {
      component.spaceId = 'mockSpaceId';
      component.applicationId = 'mockAppId';
      component.environment = 'mockEnvironment';
    },
  );

  it('should be active by default', (): void => {
    expect(testContext.testedDirective).toBeTruthy();
  });

  it('should not display inactive environments', fakeAsync((): void => {
    TestBed.get(DeploymentsService)
      .isApplicationDeployedInEnvironment()
      .next(false);
    expect(testContext.testedDirective.active).toBeFalsy();
  }));

  describe('#delete', (): void => {
    it('should clear "deleting" flag when request completes successfully', (): void => {
      const deleting: Subject<string> = TestBed.get(DeploymentsService).deleteDeployment();

      expect(testContext.testedDirective.active).toBeTruthy();
      expect(testContext.testedDirective.deleting).toBeFalsy();

      testContext.testedDirective.delete();
      expect(testContext.testedDirective.active).toBeTruthy();
      expect(testContext.testedDirective.deleting).toBeTruthy();

      deleting.next('delete success');
      expect(testContext.testedDirective.active).toBeFalsy();
      expect(testContext.testedDirective.deleting).toBeFalsy();
    });

    it('should clear "deleting" flag when request completes with error', (): void => {
      const deleting: Subject<string> = TestBed.get(DeploymentsService).deleteDeployment();

      expect(testContext.testedDirective.active).toBeTruthy();
      expect(testContext.testedDirective.deleting).toBeFalsy();

      testContext.testedDirective.delete();
      expect(testContext.testedDirective.active).toBeTruthy();
      expect(testContext.testedDirective.deleting).toBeTruthy();

      deleting.error('delete failure');
      expect(testContext.testedDirective.active).toBeTruthy();
      expect(testContext.testedDirective.deleting).toBeFalsy();
    });
  });

  it('should set versionLabel from mockSvc.getVersion result', (): void => {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

    const de: DebugElement = testContext.fixture.debugElement.query(By.css('#versionLabel'));
    const el: HTMLElement = de.nativeElement;
    expect(mockSvc.getVersion).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(el.textContent).toEqual('1.2.3');
  });

  it('should invoke deployments service calls with the correct arguments', (): void => {
    const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);

    expect(mockSvc.isApplicationDeployedInEnvironment).toHaveBeenCalledWith(
      'mockSpaceId',
      'mockEnvironment',
      'mockAppId',
    );
    expect(mockSvc.getLogsUrl).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
    expect(mockSvc.getConsoleUrl).toHaveBeenCalledWith(
      'mockSpaceId',
      'mockEnvironment',
      'mockAppId',
    );
    expect(mockSvc.getAppUrl).toHaveBeenCalledWith('mockSpaceId', 'mockEnvironment', 'mockAppId');
  });

  it('should set icon status from DeploymentStatusService aggregate', (): void => {
    const mockStatusSvc: jasmine.SpyObj<DeploymentStatusService> = TestBed.get(
      DeploymentStatusService,
    );
    const mockStatus: Subject<Status> = mockStatusSvc.getDeploymentAggregateStatus();

    expect(mockStatusSvc.getDeploymentAggregateStatus).toHaveBeenCalledWith(
      'mockSpaceId',
      'mockEnvironment',
      'mockAppId',
    );
    expect(testContext.testedDirective.toolTip).toEqual('warning message');
    expect(testContext.testedDirective.iconClass).toEqual('pficon-warning-triangle-o');
    expect(testContext.testedDirective.cardStatusClass).toEqual('status-ribbon-warn');

    mockStatus.next({ type: StatusType.ERR, message: 'error message' });
    expect(testContext.testedDirective.toolTip).toEqual('error message');
    expect(testContext.testedDirective.iconClass).toEqual('pficon-error-circle-o');
    expect(testContext.testedDirective.cardStatusClass).toEqual('status-ribbon-err');

    mockStatus.next({ type: StatusType.OK, message: '' });
    expect(testContext.testedDirective.toolTip).toEqual(DeploymentCardComponent.OK_TOOLTIP);
    expect(testContext.testedDirective.iconClass).toEqual('pficon-ok');
    expect(testContext.testedDirective.cardStatusClass).toEqual('');
  });

  describe('async tests', (): void => {
    describe('dropdown menus', (): void => {
      let menuItems: DebugElement[];

      function getItemByLabel(label: string): DebugElement {
        return menuItems.filter(
          (item: DebugElement): boolean => item.nativeElement.textContent.includes(label),
        )[0];
      }

      beforeEach(fakeAsync((): void => {
        const de: DebugElement = testContext.fixture.debugElement.query(
          By.directive(BsDropdownToggleDirective),
        );
        de.triggerEventHandler('click', new CustomEvent('click'));

        testContext.fixture.detectChanges();
        tick();

        const menu: DebugElement = testContext.fixture.debugElement.query(By.css('.dropdown-menu'));
        menuItems = menu.queryAll(By.css('li'));
      }));

      it('should not display appUrl if none available', fakeAsync((): void => {
        testContext.testedDirective.appUrl = of('');

        testContext.fixture.detectChanges();

        const menu: DebugElement = testContext.fixture.debugElement.query(By.css('.dropdown-menu'));
        menuItems = menu.queryAll(By.css('li'));
        const item: DebugElement = getItemByLabel('Open Application');
        expect(item).toBeFalsy();
      }));

      it('should call the delete modal open method', fakeAsync((): void => {
        spyOn(testContext.testedDirective, 'openModal').and.callFake((): void => {});

        const item: DebugElement = getItemByLabel('Delete');
        expect(item).toBeTruthy();
        item.query(By.css('a')).triggerEventHandler('click', new CustomEvent('click'));
        testContext.fixture.detectChanges();

        expect(testContext.testedDirective.openModal).toHaveBeenCalled();
      }));

      it('should call the delete service method when the modal event fires', fakeAsync((): void => {
        const mockSvc: jasmine.SpyObj<DeploymentsService> = TestBed.get(DeploymentsService);
        const de: DebugElement = testContext.fixture.debugElement.query(
          By.directive(FakeDeleteDeploymentModal),
        );
        expect(mockSvc.deleteDeployment).not.toHaveBeenCalled();
        de.componentInstance.deleteEvent.emit();
        expect(mockSvc.deleteDeployment).toHaveBeenCalledWith(
          'mockSpaceId',
          'mockEnvironment',
          'mockAppId',
        );
      }));
    });
  });
});
