import { DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import { ProviderService } from '../shared/account/provider.service';
import { GettingStartedComponent } from './getting-started.component';

describe('GettingStartedComponent', () => {

  let fixture: ComponentFixture<GettingStartedComponent>;
  let component: DebugNode['componentInstance'];

  let mockRouter: any = jasmine.createSpy('Router');
  let mockProvider: any = jasmine.createSpyObj('ProviderService', ['linkOpenShift']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['isOpenShiftConnected']);

  const mockUser: any = {
    attributes: {
      username: 'userName'
    }
  };

  let mockActivatedRoute = {
    snapshot: {
      queryParams: {
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [GettingStartedComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: ProviderService, useValue: mockProvider },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserService, useValue: mockUserService }
      ],
      schemas: []
    });
    fixture = TestBed.createComponent(GettingStartedComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should automatically link openshift when it is not connected', () => {
    mockUserService.loggedInUser = Observable.of(mockUser);
    mockAuthenticationService.isOpenShiftConnected.and.returnValue(Observable.of(false));
    fixture.detectChanges();
    expect(mockProvider.linkOpenShift).toHaveBeenCalled();
    expect(component.errorConnecting).toBe(false);
  });

  it('should not link openshift when it is connected', () => {

    mockUserService.loggedInUser = Observable.of(mockUser);
    mockAuthenticationService.isOpenShiftConnected.and.returnValue(Observable.of(true));
    spyOn(component, 'routeToHomeIfCompleted');
    spyOn(component, 'isGettingStartedPage').and.returnValue(true);
    fixture.detectChanges();
    expect(component.routeToHomeIfCompleted).toHaveBeenCalled();
    expect(component.errorConnecting).toBe(false);
  });

  it('should not link openshift when it fails to connect', () => {
    mockUserService.loggedInUser = Observable.of(mockUser);
    mockAuthenticationService.isOpenShiftConnected.and.returnValue(Observable.of(false));
    component.route = {
      snapshot: {
        queryParams: {
          wait: 'true'
        }
      }
    };
    fixture.detectChanges();
    expect(component.errorConnecting).toBe(true);
  });
});
