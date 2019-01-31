import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Broadcaster, Logger } from 'ngx-base';
import { Contexts, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { of, throwError as observableThrowError } from 'rxjs';
import { TenantService } from '../services/tenant.service';
import { CleanupComponent } from './cleanup.component';

describe('CleanupComponent', () => {
  let fixture: ComponentFixture<CleanupComponent>;
  let component: DebugNode['componentInstance'];

  const mockBroadcaster: jasmine.SpyObj<Broadcaster> = jasmine.createSpyObj('Broadcaster', [
    'broadcast',
  ]);

  const mockContexts: any = jasmine.createSpy('Contexts');
  const mockSpaceService: any = jasmine.createSpyObj('SpaceService', ['delete', 'getSpacesByUser']);
  const mockTenantService: any = jasmine.createSpyObj('TenantService', [
    'cleanupTenant',
    'updateTenant',
  ]);
  const mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  const mockLogger: any = jasmine.createSpy('Logger');
  const mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', [
    'getToken',
  ]);
  const mockUserService: any = jasmine.createSpy('UserService');
  let mockSpace: any;

  beforeEach(() => {
    mockSpace = {
      name: 'mock-space',
      path: 'mock-path',
      id: 'mock-id',
      attributes: {
        name: 'mock-attribute',
        description: 'mock-description',
        'updated-at': 'mock-updated-at',
        'created-at': 'mock-created-at',
        version: 0,
      },
    };
    mockContexts.current = of({
      user: {
        attributes: {
          username: 'mock-username',
        },
        id: 'mock-user',
      },
    });
    mockSpaceService.getSpacesByUser.and.returnValue(of([mockSpace]));

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CleanupComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: Router, useValue: mockRouter },
        { provide: Logger, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: UserService, useValue: mockUserService },
        { provide: WIT_API_URL, useValue: 'http://example.com' },
        { provide: Broadcaster, useValue: mockBroadcaster },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideProvider(TenantService, { useValue: mockTenantService });
    fixture = TestBed.createComponent(CleanupComponent);
    fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
    component.confirmCleanup = jasmine.createSpyObj('IModalHost', ['open', 'close']);
  });

  describe('#confirmErase', () => {
    it('should open the confirm cleanup modal', () => {
      component.confirmErase();
      expect(component.confirmCleanup.open).toHaveBeenCalled();
    });
  });

  describe('#confirm', () => {
    it('should show a success message if spaces were erased successfully', () => {
      component.spaces = [mockSpace];
      component.spaceService.delete.and.returnValue(of(mockSpace));
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();
      expect(mockSpace['erased']).toBeTruthy();
      expect(mockSpace['progress']).toBe('Space successfully erased');
      expect(component.showSuccessNotification).toHaveBeenCalled();
    });

    it('should call delete with skipCluster set to true', () => {
      component.spaces = [mockSpace];
      component.spaceService.delete.and.returnValue(of(mockSpace));
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();
      expect(mockSpace['erased']).toBeTruthy();
      expect(mockSpace['progress']).toBe('Space successfully erased');
      expect(component.showSuccessNotification).toHaveBeenCalled();

      expect(component.spaceService.delete).toHaveBeenCalledWith(mockSpace, true);
    });

    it('should broadcast space deleted', () => {
      component.spaces = [mockSpace];
      component.spaceService.delete.and.returnValue(of(mockSpace));
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();

      expect(component.broadcaster.broadcast).toHaveBeenCalledWith('spaceDeleted', mockSpace);
    });

    it('should show a notification if a space is unable to be erased', () => {
      component.spaces = [mockSpace];
      component.spaceService.delete.and.returnValue(observableThrowError('error'));
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(of('mock-response'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(mockSpace['erased']).toBeFalsy();
      expect(mockSpace['progress']).toBe('Error: Unable to erase');
      expect(component.showWarningNotification).toHaveBeenCalled();
    });

    it('should show an error notification if tenant cleanup failed', () => {
      component.tenantService.cleanupTenant.and.returnValue(observableThrowError('error'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(component.tenantError).toBe('error');
      expect(component.tenantResult).toBe('Tenant cleanup failed');
      expect(component.showWarningNotification).toHaveBeenCalled();
    });

    it('should show a successful notification if tenant update & reset worked', () => {
      component.spaces = [mockSpace];
      component.spaceService.delete.and.returnValue(of(mockSpace));
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();
      expect(component.showSuccessNotification).toHaveBeenCalled();
      expect(component.tenantResult).toBe('Tenant reset successful');
    });

    it('should show a warning notification if tenant update failed', () => {
      component.tenantService.cleanupTenant.and.returnValue(of('mock-response'));
      component.tenantService.updateTenant.and.returnValue(observableThrowError('error'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(component.showWarningNotification).toHaveBeenCalled();
      expect(component.tenantResult).toBe('Tenant update failed');
    });
  });

  describe('#userNameMatches', () => {
    it('should return true if the two usernames match', () => {
      component.contextUserName = 'foo';
      component.userName = 'foo';
      const result: boolean = component.userNameMatches();
      expect(result).toBeTruthy();
    });

    it('should return false if the two usernames are different', () => {
      component.contextUserName = 'foo';
      component.userName = 'bar';
      const result: boolean = component.userNameMatches();
      expect(result).toBeFalsy();
    });
  });

  describe('#showSuccessNotification', () => {
    it('should show a success notification', () => {
      component.showNotification = false;
      component.showSuccessNotification();
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationTitle).toBe('Success!');
    });
  });

  describe('#showWarningNotification', () => {
    it('should show an alert notification', () => {
      component.showNotification = false;
      component.showWarningNotification();
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationTitle).toBe('Alert!');
    });
  });

  describe('#toggleTenantError', () => {
    it('should toggle the boolean value of tenantErrorExpanded', () => {
      component.tenantErrorExpanded = false;
      component.toggleTenantError();
      expect(component.tenantErrorExpanded).toBeTruthy();
    });
  });

  describe('#goHome', () => {
    it('should navigate back to the home page', () => {
      component.goHome();
      expect(component.router.navigate).toHaveBeenCalledWith(['/', '_home']);
    });
  });
});
