import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions, XHRBackend, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AuthenticationService } from 'ngx-login-client';
import { Fabric8ForgeService } from './fabric8-forge.service';
import { ApiLocatorService } from '../../../shared/api-locator.service';
import { LoggerFactory } from '../common/logger';
import { expectedResponse, expectedError } from './fabric8-forge.service.mock';

describe('Fabric8ForgeService:', () => {

  let mockLog: any;
  let fabric8ForgeService: Fabric8ForgeService;
  let mockAuthService: any;
  let mockService: MockBackend;
  let mockApiLocatorService: any;


  beforeEach(() => {
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken', 'isLoggedIn']);
    mockApiLocatorService = jasmine.createSpyObj('ApiLocatorService', ['forgeApiUrl']);

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: LoggerFactory, useValue: mockLog
        },
        {
          provide: XHRBackend, useClass: MockBackend
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: ApiLocatorService,
          useValue: mockApiLocatorService
        },
        Fabric8ForgeService
      ]
    });
    fabric8ForgeService = TestBed.get(Fabric8ForgeService);
    mockService = TestBed.get(XHRBackend);
  });

  it('Get command successfully', () => {
    // given
    const log = () => { };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.getToken.and.returnValue("SSO_TOKEN");
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedResponse),
          status: 200
        })
      ));
    });
    // when
    fabric8ForgeService.GetCommand("http://somewhere.com").subscribe((data: any) => {
      // then
      expect(data.payload.data).toEqual(expectedResponse);
    });

  });

  it('Get command in error of type Error', () => {
    // given
    const log = () => { };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.getToken.and.returnValue("SSO_TOKEN");
     mockAuthService.isLoggedIn.and.returnValue(true);
    mockService.connections.subscribe((connection: any) => {
      connection.mockError(new Error('some error'));
    });
    // when
    fabric8ForgeService.GetCommand("http://somewhere.com").subscribe((data: any) => {
      fail('Get command in error');
    }, // then
      error => expect(error.name).toEqual('ForgeApiClientError'));
  });

  it('Get command in error with Keycloak exception', () => {
    // given
    const log = () => { };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.getToken.and.returnValue("SSO_TOKEN");
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockService.connections.subscribe((connection: any) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(expectedError),
          status: 500
        })
      ));
    });
    // when
    fabric8ForgeService.GetCommand("http://somewhere.com")
    .subscribe((data: any) => {
      // then
        expect(data.payload.data._body.cause.type).toEqual('io.fabric8.forge.generator.keycloak.KeyCloakFailureException');
        expect(data.payload.data._body.cause.message).toEqual('KeyCloak failed to return a token for OpenShift o https://sso.openshift.io/auth/realms/fabric8/broker/openshift-v3/token');
    }, // then
      error => {
        fail('Get command in error for KeyCloak');
      })
  });

  it('Get command without being logged', () => {
    // given
    const log = () => { };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.isLoggedIn.and.returnValue(false);
    mockAuthService.getToken.and.returnValue(null);
    let expectedError = {
      origin: 'Fabric8ForgeService',
      name: 'Authentication error',
      message: 'Please login to be able to add to space.'
    };
    // when
    fabric8ForgeService.GetCommand("http://somewhere.com").subscribe((data: any) => {
      fail('Get command in error');
    }, // then
    err => expect(err).toEqual(expectedError));

  });
});
