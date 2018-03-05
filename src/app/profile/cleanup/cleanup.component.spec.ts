import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { Logger } from 'ngx-base';
import { Contexts, SpaceService, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { EventService } from '../../shared/event.service';
import { TenantService } from '../services/tenant.service';
import { CleanupComponent } from './cleanup.component';


describe('CleanupComponent', () => {

  let fixture: ComponentFixture<CleanupComponent>;
  let component: DebugNode['componentInstance'];
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockSpaceService: any = jasmine.createSpy('SpaceService');
  let mockTenantService: any = jasmine.createSpy('TenantService');
  let mockEventService: any = jasmine.createSpy('EventService');
  let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  let mockLogger: any = jasmine.createSpy('Logger');
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getToken']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockSpace: any;

  mockSpaceService.deleteSpace = {};
  mockEventService.deleteSpaceSubject = jasmine.createSpyObj('deleteSpaceSubject', ['next']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [CleanupComponent],
      providers: [
        { provide: Contexts, useValue: mockContexts },
        { provide: SpaceService, useValue: mockSpaceService },
        { provide: TenantService, useValue: mockTenantService },
        { provide: EventService, useValue: mockEventService },
        { provide: Router, useValue: mockRouter },
        { provide: Logger, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: UserService, useValue: mockUserService },
        { provide: WIT_API_URL, useValue: 'http://example.com'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CleanupComponent);
    component = fixture.debugElement.componentInstance;
    component.confirmCleanup = jasmine.createSpyObj('IModalHost', ['open', 'close']);
    mockSpace = jasmine.createSpy('Space');
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
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.of(mockSpace));
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component.tenantService, 'updateTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();
      expect(mockEventService.deleteSpaceSubject.next).toHaveBeenCalled();
      expect(mockSpace['erased']).toBeTruthy();
      expect(mockSpace['progress']).toBe('Space successfully erased');
      expect(component.showSuccessNotification).toHaveBeenCalled();
    });

    it('should show a notification if a space is unable to be erased', () => {
      component.spaces = [mockSpace];
      spyOn(component.spaceService, 'deleteSpace').and.returnValue(Observable.throw('error'));
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component.tenantService, 'updateTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(mockSpace['erased']).toBeFalsy();
      expect(mockSpace['progress']).toBe('Error: Unable to erase');
      expect(component.showWarningNotification).toHaveBeenCalled();
    });

    it('should show an error notification if tenant cleanup failed', () => {
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.throw('error'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(component.tenantError).toBe('error');
      expect(component.tenantResult).toBe('Tenant cleanup failed');
      expect(component.showWarningNotification).toHaveBeenCalled();
    });

    it('should show a successful notification if tenant update & reset worked', () => {
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component.tenantService, 'updateTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component, 'showSuccessNotification');
      component.confirm();
      expect(component.showSuccessNotification).toHaveBeenCalled();
      expect(component.tenantResult).toBe('Tenant reset successful');
    });

    it('should show a warning notification if tenant update failed', () => {
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(component.tenantService, 'updateTenant').and.returnValue(Observable.throw('error'));
      spyOn(component, 'showWarningNotification');
      component.confirm();
      expect(component.showWarningNotification).toHaveBeenCalled();
      expect(component.tenantResult).toBe('Tenant update failed');
    });

    it('should show a warning notification if the fork joined observable results in an error', () => {
      spyOn(component.tenantService, 'cleanupTenant').and.returnValue(Observable.of('mock-response'));
      spyOn(Observable, 'forkJoin').and.returnValue(Observable.throw('error'));
      spyOn(component, 'showWarningNotification');
      component.tenantCleanError = true;
      component.confirm();
      expect(component.showWarningNotification).toHaveBeenCalled();
    });
  });

  describe('#userNameMatches', () => {
    it('should return true if the two usernames match', () => {
      component.contextUserName = 'foo';
      component.userName = 'foo';
      let result: boolean = component.userNameMatches();
      expect(result).toBeTruthy();
    });

    it('should return false if the two usernames are different', () => {
      component.contextUserName = 'foo';
      component.userName = 'bar';
      let result: boolean = component.userNameMatches();
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
