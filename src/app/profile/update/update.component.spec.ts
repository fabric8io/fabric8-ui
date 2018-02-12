import { Component, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { Logger } from 'ngx-base/src/app/logger.service';
import { Notifications } from 'ngx-base/src/app/notifications/notifications';
import { Contexts, WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { initContext, TestContext } from '../../../testing/test-context';
import { GettingStartedService } from '../../getting-started/services/getting-started.service';
import { ProviderService } from '../../shared/account/provider.service';
import { GitHubService } from '../../space/create/codebases/services/github.service';
import { CopyService } from '../services/copy.service';
import { TenentService } from '../services/tenent.service';
import { UpdateComponent } from './update.component';

describe('UpdateComponent', () => {

  let fixture;
  let mockAuthenticationService: any = jasmine.createSpyObj('AuthenticationService', ['getToken']);
  let mockCopyService: any = jasmine.createSpy('CopyService');
  let mockGettingStartedService: any = jasmine.createSpy('GettingStartedService');
  let mockContexts: any = jasmine.createSpy('Contexts');
  let mockGitHubService: any = jasmine.createSpy('GitHubService');
  let mockNotifications: any = jasmine.createSpy('Notifications');
  let mockProviderService: any = jasmine.createSpyObj('ProviderService', ['getGitHubStatus']);
  let mockRenderer: any = jasmine.createSpy('Renderer2');
  let mockRouter: any = jasmine.createSpy('Router');
  let mockTenentService: any = jasmine.createSpy('TenentService');
  let mockUserService: any = jasmine.createSpy('UserService');
  let mockLogger: any = jasmine.createSpy('Logger');

  mockAuthenticationService.gitHubToken = Observable.of('gh-test-user');
  mockContexts.current = Observable.empty();
  mockUserService.currentLoggedInUser = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule],
      declarations: [UpdateComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: CopyService, useValue: mockCopyService },
        { provide: GettingStartedService, useValue: mockGettingStartedService },
        { provide: Contexts, useValue: mockContexts },
        { provide: GitHubService, useValue: mockGitHubService },
        { provide: Notifications, useValue: mockNotifications },
        { provide: ProviderService, useValue: mockProviderService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: Router, useValue: mockRouter },
        { provide: TenentService, useValue: mockTenentService },
        { provide: UserService, useValue: mockUserService },
        { provide: Logger, useValue: mockLogger },
        { provide: WIT_API_URL, useValue: 'http://example.com'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(UpdateComponent);
  });

  describe('#isEmailValid', () => {
    // Test strings for e-mails borrowed from https://en.wikipedia.org/wiki/Email_address#Examples

    it('should verify prettyandsimple@example.com to be a valid address', () => {
      let validAddress: string = 'prettyandsimple@example.com';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify very.common@example.com to be a valid address', () => {
      let validAddress: string = 'very.common@example.com';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify "very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com to be a valid address', () => {
      let validAddress: string = '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeTruthy();
    });

    it('should verify an empty string to be an invalid address', () => {
      let validAddress: string = '';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify name@ to be an invalid address', () => {
      let validAddress: string = 'name@';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify @ to be an invalid address', () => {
      let validAddress: string = '@';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });

    it('should verify A@b@c@example.com to be an invalid address', () => {
      let validAddress: string = 'A@b@c@example.com';
      let result = fixture.debugElement.componentInstance.isEmailValid(validAddress);
      expect(result).toBeFalsy();
    });
  });

});
