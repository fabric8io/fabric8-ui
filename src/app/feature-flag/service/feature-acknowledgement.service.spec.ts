import { TestBed } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';

import { ErrorHandler } from '@angular/core';
import { loggedInUser } from '../../shared/context.service.mock';
import { FeatureAcknowledgementService } from './feature-acknowledgement.service';

describe('FeatureAcknowledgement service: it', () => {
  let extUser = loggedInUser;
  let featureAckService: FeatureAcknowledgementService;
  let mockLog: any;
  let mockErrorHandler: any;
  let mockAuthService: any;
  let mockUserService: any;

  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockErrorHandler = jasmine.createSpy('ErrorHandler');
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);

    // Set mock feature acknowledgement flag
    (extUser.attributes.contextInformation as any).featureAcknowledgement = {
      'Planner': true,
      'Dummy': false
    };

    mockUserService.getUserByUserId.and.returnValue(Observable.of(extUser));
    mockUserService.loggedInUser = Observable.of(extUser);

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: Logger, useValue: mockLog
        },
        {
          provide: ErrorHandler,
          useValue: mockErrorHandler
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: WIT_API_URL,
          useValue: 'http://example.com'
        },
        FeatureAcknowledgementService
      ]
    });
    featureAckService = TestBed.get(FeatureAcknowledgementService);
  });

  it('should tell whether the "Planner" feature is acknowledged', () => {
    expect(featureAckService.getAcknowledgement('Planner')).toBe(true);
  });

  it('should tell whether the "Dummy" feature is acknowledged', () => {
    expect(featureAckService.getAcknowledgement('Dummy')).toBe(false);
  });

  it('should tell whether an undefined feature is acknowledged', () => {
    expect(featureAckService.getAcknowledgement('Test')).toBe(false);
  });
});
