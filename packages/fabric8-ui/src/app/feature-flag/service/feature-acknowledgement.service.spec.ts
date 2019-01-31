import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { ExtUser } from '../../getting-started/services/getting-started.service';
import { loggedInUser } from '../../shared/context.service.mock';
import { FeatureAcknowledgementService } from './feature-acknowledgement.service';

describe('FeatureAcknowledgement service:', () => {
  const extUser: ExtUser = loggedInUser as ExtUser;
  let featureAckService: FeatureAcknowledgementService;
  let mockLog: any;
  let mockAuthService: any;
  let mockUserService: any;

  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['log']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserByUserId']);
    (extUser.attributes.contextInformation as any).featureAcknowledgement = true;
    mockUserService.getUserByUserId.and.returnValue(observableOf(extUser));
    mockUserService.loggedInUser = observableOf(extUser);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Logger,
          useValue: mockLog,
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: WIT_API_URL,
          useValue: 'http://example.com',
        },
        FeatureAcknowledgementService,
      ],
    });
    featureAckService = TestBed.get(FeatureAcknowledgementService);
  });

  it('should tell whether a user has agreed to keep the display of feature icon', async(() => {
    // when
    featureAckService
      .getToggle()
      .pipe(first())
      .subscribe((val) => {
        // then
        expect(val).toEqual(true);
      });
  }));

  it('should tell whether a user has toggled off the display of feature icon', async(() => {
    // given
    (extUser.attributes.contextInformation as any).featureAcknowledgement = false;
    mockUserService.getUserByUserId.and.returnValue(observableOf(extUser));
    mockUserService.loggedInUser = observableOf(extUser);
    // when
    featureAckService
      .getToggle()
      .pipe(first())
      .subscribe((val) => {
        // then
        expect(val).toEqual(false);
      });
  }));
});
