import { DebugNode, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger, Notifications, NotificationType } from 'ngx-base';
import { Contexts, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { of, throwError as observableThrowError } from 'rxjs';
import { GettingStartedService } from '../../getting-started/services/getting-started.service';
import { GitHubService } from '../../space/create/codebases/services/github.service';
import { CopyService } from '../services/copy.service';
import { TenantService } from '../services/tenant.service';
import { TenantUpdateStatus, UpdateComponent } from './update.component';

describe('UpdateComponent', () => {
  let fixture: ComponentFixture<UpdateComponent>;
  let component: DebugNode['componentInstance'];

  const mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', [
    'getToken',
  ]);
  const mockCopyService: any = jasmine.createSpyObj('CopyService', ['copy']);
  const mockGettingStartedService: any = jasmine.createSpyObj('GettingStartedService', [
    'createTransientProfile',
    'update',
    'ngOnDestroy',
  ]);
  const mockContexts: any = jasmine.createSpy('Contexts');
  const mockGitHubService: any = jasmine.createSpyObj('GitHubService', ['getUser']);
  const mockNotifications: any = jasmine.createSpyObj('Notifications', ['message']);
  const mockRouter: any = jasmine.createSpyObj('Router', ['navigate']);
  const mockTenantService: any = jasmine.createSpyObj('TenantService', ['updateTenant']);
  const mockUserService: any = jasmine.createSpy('UserService');
  const mockLogger: any = jasmine.createSpy('Logger');

  mockAuthenticationService.gitHubToken = of('gh-test-user');
  mockContexts.current = of({
    user: {
      attributes: {
        username: 'foobar',
      },
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UpdateComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: Contexts, useValue: mockContexts },
        { provide: Notifications, useValue: mockNotifications },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: Logger, useValue: mockLogger },
        { provide: WIT_API_URL, useValue: 'http://example.com' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.overrideProvider(CopyService, { useValue: mockCopyService });
    TestBed.overrideProvider(GettingStartedService, { useValue: mockGettingStartedService });
    TestBed.overrideProvider(GitHubService, { useValue: mockGitHubService });
    TestBed.overrideProvider(TenantService, { useValue: mockTenantService });

    mockUserService.currentLoggedInUser = {};

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  describe('#isUpdateProfileDisabled', () => {
    it('should be false if the urls are valid but at least one of the forms is dirty ', () => {
      component.profileForm = jasmine.createSpy('profileForm');
      component.profileForm.dirty = true;
      component.advancedForm = jasmine.createSpy('advancedForm');
      component.advancedForm.dirty = false;
      const result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeFalsy();
    });

    it('should be true if bio is invalid is invalid', () => {
      component.bioInvalid = true;
      const result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeTruthy();
    });

    it('should be true if at least one of the urls is invalid', () => {
      component.emailInvalid = true;
      const result: boolean = component.isUpdateProfileDisabled;
      expect(result).toBeTruthy();
    });
  });

  describe('#copyTokenToClipboard', () => {
    it('should show a success message if token was copied', () => {
      const message = {
        message: 'Token copied!',
        type: NotificationType.SUCCESS,
      };
      component.copyService.copy.and.returnValue(true);
      component.copyTokenToClipboard();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an danger message if there was an error', () => {
      const message = {
        message: 'Failed to copy token',
        type: NotificationType.DANGER,
      };
      component.copyService.copy.and.returnValue(false);
      component.copyTokenToClipboard();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });
  });

  describe('#linkImageUrl', () => {
    it('should properly link the avatar image if image exists', () => {
      component.gitHubService.getUser.and.returnValue(
        of({
          avatar_url: 'mock-image',
        }),
      );
      component.linkGithubImageUrl();
      expect(component.imageUrl).toBe('mock-image');
    });

    it('should show an error message if no image is found', () => {
      const message = {
        message: 'No image found',
        type: NotificationType.INFO,
      };
      component.gitHubService.getUser.and.returnValue(of({}));
      component.linkGithubImageUrl();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show a warning message if unable to link the image', () => {
      const message = {
        message: 'Unable to link image',
        type: NotificationType.WARNING,
      };
      component.gitHubService.getUser.and.returnValue(observableThrowError('error'));
      component.linkGithubImageUrl();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });
  });

  describe('#routeToProfile', () => {
    it("should route to the user's profile page", () => {
      component.routeToProfile();
      expect(component.router.navigate).toHaveBeenCalledWith(['/', 'foobar']);
    });
  });

  describe('#resetPasswordUrl', () => {
    it('should open a window to reset the password', () => {
      const url: string = 'https://developers.redhat.com/auth/realms/rhd/account/password';
      spyOn(window, 'open');
      component.resetPasswordUrl();
      expect(window.open).toHaveBeenCalledWith(url);
    });
  });

  describe('#toggleTokenPanel', () => {
    it('should toggle boolean states when called', () => {
      component.tokenPanelOpen = true;
      component.toggleTokenPanel();
      expect(component.tokenPanelOpen).toBeFalsy();
    });
  });

  describe('#updateProfile', () => {
    // Mock initial profile data from GettingStartedService
    const mockUser: User = {
      attributes: {
        bio: 'old-bio',
        company: 'old-company',
        email: 'old-email',
        emailPrivate: false,
        fullName: 'old-fullName',
        imageURL: 'old-imageUrl',
        url: 'old-url',
        username: 'old-username',
      },
      id: 'mock-id',
      type: 'mock-type',
    };

    it('should update the profile with the expected information', () => {
      const message = {
        message: 'Profile updated!',
        type: NotificationType.SUCCESS,
      };
      // New profile data to be saved
      component.bio = 'new-bio';
      component.company = 'new-company';
      component.email = 'new-email';
      component.fullName = 'new-fullName';
      component.imageUrl = 'new-imageUrl';
      component.url = 'new-url';
      component.emailPrivate = false;
      component.gettingStartedService.createTransientProfile.and.returnValue(mockUser.attributes);
      component.gettingStartedService.update.and.returnValue(of(mockUser));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error 409 status if the e-mail provided already exists', () => {
      const message = {
        message: 'Email already exists',
        type: NotificationType.DANGER,
      };
      component.gettingStartedService.createTransientProfile.and.returnValue(mockUser.attributes);
      component.gettingStartedService.update.and.returnValue(observableThrowError({ status: 409 }));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error if the profile has failed to update', () => {
      const message = {
        message: 'Failed to update profile',
        type: NotificationType.DANGER,
      };
      component.gettingStartedService.createTransientProfile.and.returnValue(mockUser.attributes);
      component.gettingStartedService.update.and.returnValue(observableThrowError('error'));
      component.updateProfile();
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });
  });

  describe('#updateTenant', () => {
    it('should update the tenant if successful', () => {
      const message = {
        message: 'Profile updated!',
        type: NotificationType.SUCCESS,
      };
      component.tenantService.updateTenant.and.returnValue(of({ status: 200 }));
      component.updateTenant();
      expect(component.updateTenantStatus).toBe(TenantUpdateStatus.Success);
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error if the tenant has failed to update', () => {
      const message = {
        message: 'Error updating tenant',
        type: NotificationType.DANGER,
      };
      component.tenantService.updateTenant.and.returnValue(of({ status: 404 }));
      component.updateTenant();
      expect(component.updateTenantStatus).toBe(TenantUpdateStatus.Failure);
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });

    it('should show an error if the tenant has suffered an unexpected error when updating', () => {
      const message = {
        message: 'Unexpected error updating tenant',
        type: NotificationType.DANGER,
      };
      component.tenantService.updateTenant.and.returnValue(observableThrowError('error'));
      component.updateTenant();
      expect(component.updateTenantStatus).toBe(TenantUpdateStatus.Failure);
      expect(component.notifications.message).toHaveBeenCalledWith(message);
    });
  });

  describe('#cleanupTenant', () => {
    it('should navigate to the cleanup page', () => {
      component.cleanupTenant();
      expect(component.router.navigate).toHaveBeenCalledWith(['/', 'foobar', '_cleanup']);
    });
  });

  describe('#validateUrl', () => {
    it('should verify not-a-real-url to be an invalid url', () => {
      const urls: string[] = [
        'not-a-real-url',
        'http://',
        '.com',
        'htt:/not-a-real-url.some-thing.',
      ];
      urls.forEach((url) => {
        component.url = url;
        component.validateUrl();
        expect(component.urlInvalid).toBeTruthy();
      });
    });

    it('should verify https://fabric8.io/ to be a valid url', () => {
      const url: string = 'https://fabric8.io/';
      component.url = url;
      component.validateUrl();
      expect(component.urlInvalid).toBeFalsy();
    });
  });

  describe('#isEmailValid', () => {
    // Test strings for e-mails borrowed from https://en.wikipedia.org/wiki/Email_address#Examples
    it('should verify prettyandsimple@example.com to be a valid address', () => {
      const validAddress: string = 'prettyandsimple@example.com';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify very.common@example.com to be a valid address', () => {
      const validAddress: string = 'very.common@example.com';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify "very.(),:;<>[]".VERY."very@\\ "very".unusual"@strange.example.com to be a valid address', () => {
      const validAddress: string =
        '"very.(),:;<>[]".VERY."very@\\ "very".unusual"@strange.example.com';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify an empty string to be an invalid address', () => {
      const validAddress: string = '';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify name@ to be an invalid address', () => {
      const validAddress: string = 'name@';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify @ to be an invalid address', () => {
      const validAddress: string = '@';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify A@b@c@example.com to be an invalid address', () => {
      const validAddress: string = 'A@b@c@example.com';
      const result = component.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });
  });
});
