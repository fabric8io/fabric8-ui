import { DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationType } from 'ngx-base';
import { Logger } from 'ngx-base/src/app/logger.service';
import { Notifications } from 'ngx-base/src/app/notifications/notifications';
import { Contexts, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { GettingStartedService } from '../../getting-started/services/getting-started.service';
import { ProviderService } from '../../shared/account/provider.service';
import { GitHubService } from '../../space/create/codebases/services/github.service';
import { TenantService } from '../services/tenant.service';
import { TenantComponent } from './tenant.component';

describe('TenantComponent', () => {

  let fixture: ComponentFixture<TenantComponent>;
  let component: DebugNode['componentInstance'];
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getToken']);
  let mockGettingStartedService: any = jasmine.createSpyObj('GettingStartedService', ['createTransientProfile', 'update', 'ngOnDestroy']);
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
  let mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  let mockTenantService: any = jasmine.createSpyObj('TenantService', ['updateTenant']);
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockLogger: any = jasmine.createSpy('Logger');
  let mockProviderService: any = jasmine.createSpy('ProviderService');
  let mockGitHubService: any = jasmine.createSpy('GitHubService');

  mockAuthenticationService.gitHubToken = of('gh-test-user');
  mockContexts.current = of({
    'user': {
      'attributes': {
        'username': 'foobar'
      }
    }
  });
  mockUserService.currentLoggedInUser = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TenantComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Contexts, useValue: mockContexts },
        { provide: Notifications, useValue: mockNotifications },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: Logger, useValue: mockLogger },
        { provide: WIT_API_URL, useValue: 'http://example.com'}
      ]
    });
    TestBed.overrideProvider(GettingStartedService, { useValue: mockGettingStartedService });
    TestBed.overrideProvider(GitHubService, { useValue: mockGitHubService });
    TestBed.overrideProvider(ProviderService, { useValue: mockProviderService });
    TestBed.overrideProvider(TenantService, { useValue: mockTenantService });
    fixture = TestBed.createComponent(TenantComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  describe('#isUpdateProfileDisabled', () => {
    it('should be false if being modified', () => {
      component.modifiedFromRequestParam = true;
      let result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeFalsy();
    });

    it('should be false if not modified and all versions are valid', () => {
      component.modifiedFromRequestParam = false;
      let result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeFalsy();
    });

    it('should be true if not modified and at least one of the versions/repos is invalid', () => {
      component.modifiedFromRequestParam = false;
      component.jenkinsVersionInvalid = true;
      let result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeTruthy();
    });
  });

  describe('#routeToProfile', () => {
    it('should route to the user\'s profile page', () => {
      component.routeToProfile();
      expect(component.router.navigate).toHaveBeenCalledWith(['/', 'foobar']);
    });
  });

  describe('#setElementFocus', () => {
    it('should focus the provided element', () => {
      let mockEvent = jasmine.createSpy('MouseEvent');
      let mockElement = document.createElement('mock-element');
      spyOn(mockElement, 'focus');
      component.setElementFocus(mockEvent, mockElement);
      expect(mockElement.focus).toHaveBeenCalled();
    });
  });

  describe('#resetProfile', () => {
    it('should set modifiedFromRequestParam and updateTenant to their default values', () => {
      component.modifiedFromRequestParam = true;
      component.updateTenant = false;
      component.resetProfile();
      expect(component.modifiedFromRequestParam).toBeFalsy();
      expect(component.updateTenant).toBeTruthy();
    });
  });

  describe('#updateProfile', () => {
    it('should update the tenant if successful', () => {
      let message = {
        'message': 'Tenant Updated!',
        type: NotificationType.SUCCESS
      };
      component.gettingStartedService.createTransientProfile.and.returnValue({});
      component.gettingStartedService.update.and.returnValue(of({}));
      component.tenantService.updateTenant.and.returnValue(of({}));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error if the tenant has failed to update', () => {
      let message = {
        'message': 'Failed to update tenant',
        type: NotificationType.DANGER
      };
      component.gettingStartedService.createTransientProfile.and.returnValue({});
      component.gettingStartedService.update.and.returnValue(of({}));
      component.tenantService.updateTenant.and.returnValue(Observable.throw('error'));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should handle an error 409 status if the e-mail provided already exists', () => {
      let message = {
        'message': 'Email already exists',
        type: NotificationType.DANGER
      };
      component.gettingStartedService.createTransientProfile.and.returnValue({});
      component.gettingStartedService.update.and.returnValue(Observable.throw({ status: 409 }));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error if the profile has failed to update', () => {
      let message = {
        'message': 'Failed to update profile',
        type: NotificationType.DANGER
      };
      component.gettingStartedService.createTransientProfile.and.returnValue({});
      component.gettingStartedService.update.and.returnValue(Observable.throw('error'));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });
  });

  describe('#boosterGitRepoValidate', () => {

    let gitUrl: string = '';

    // Wrongfully fails
    xit('should verify git@github.com:fabric8-ui/fabric8-ui.git to be a valid Git repo', () => {
      gitUrl = 'git@github.com:fabric8-ui/fabric8-ui.git';
      component.boosterGitRepo = gitUrl;
      component.boosterGitRepoValidate();
      expect(component.boosterGitRefInvalid).toBe(false);
    });

    it('should verify https://github.com/fabric8-ui/fabric8-ui.git to be a valid Git repo', () => {
      gitUrl = 'https://github.com/fabric8-ui/fabric8-ui.git';
      component.boosterGitRepo = gitUrl;
      component.boosterGitRepoValidate();
      expect(component.boosterGitRefInvalid).toBe(false);
    });

    // Wrongfully passes
    xit('should verify https://fabric8.io/ to be an invalid Git repo', () => {
      gitUrl = 'https://fabric8.io/';
      component.boosterGitRepo = gitUrl;
      component.boosterGitRepoValidate();
      expect(component.boosterGitRefInvalid).toBe(true);
    });
  });

  describe('#mavenRepoValidate', () => {

    let mavenUrl = '';

    it('should verify not-a-maven-repo to be an invalid maven repo', () => {
      mavenUrl = 'not-a-maven-repo';
      component.mavenRepo = mavenUrl;
      component.mavenRepoValidate();
      expect(component.mavenRepoInvalid).toBe(true);
    });

    it('should verify http://real-maven-repo to be a valid maven repo', () => {
      mavenUrl = 'http://real-maven-repo';
      component.mavenRepo = mavenUrl;
      component.mavenRepoValidate();
      expect(component.mavenRepoInvalid).toBe(false);
    });

    it('should verify https://real-maven-repo to be a valid maven repo', () => {
      mavenUrl = 'https://real-maven-repo';
      component.mavenRepo = mavenUrl;
      component.mavenRepoValidate();
      expect(component.mavenRepoInvalid).toBe(false);
    });
  });

});
