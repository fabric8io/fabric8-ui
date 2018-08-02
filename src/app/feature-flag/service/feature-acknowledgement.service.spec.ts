import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';

import { loggedInUser } from '../../shared/context.service.mock';
import { FeatureAcknowledgementService } from './feature-acknowledgement.service';

describe('FeatureAcknowledgement service:', () => {
  let extUser = loggedInUser;
  let featureAckService: FeatureAcknowledgementService;
  let mockLog: any;
  let mockAuthService: any;
  let mockUserService: any;

  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
    (extUser.attributes.contextInformation as any).featureAcknowledgement = true;
    mockUserService.getUserByUserId.and.returnValue(Observable.of(extUser));
    mockUserService.loggedInUser = Observable.of(extUser);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Logger, useValue: mockLog
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

  it('should tell whether a user has agreed to keep the display of feature icon', async(() => {
    // when
    featureAckService.getToggle()
      .first()
      .subscribe(val => {
      // then
      expect(val).toEqual(true);
    });
  }));

  it('should tell whether a user has toggled off the display of feature icon', async(() => {
    // given
    (extUser.attributes.contextInformation as any).featureAcknowledgement = false;
    mockUserService.getUserByUserId.and.returnValue(Observable.of(extUser));
    mockUserService.loggedInUser = Observable.of(extUser);
    // when
    featureAckService.getToggle()
      .first()
      .subscribe(val => {
      // then
      expect(val).toEqual(false);
    });
  }));
});
