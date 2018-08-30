import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { Broadcaster, Logger } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { ProviderService } from './provider.service';

import { createMock } from 'testing/mock';

describe('Service: Provider Service', () => {

    let service: ProviderService;
    let controller: HttpTestingController;
    let mockLogger: jasmine.SpyObj<Logger>;
    const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY2xpZW50X3Nlc3Npb24iOiJURVNUU0VTU0lPTiIsInNlc3Npb25fc3RhdGUiOiJURVNUU0VTU0lPTlNUQVRFIiwiYWRtaW4iOnRydWUsImp0aSI6ImY5NWQyNmZlLWFkYzgtNDc0YS05MTk0LWRjM2E0YWFiYzUwMiIsImlhdCI6MTUxMDU3MTMxOSwiZXhwIjoxNTEwNTgwODI3fQ.l0m6EFvk5jbND3VOXL3gTkzTz0lYQtPtXS_6C24kPQk';
    class BroadcasterTestProvider {
      static broadcaster = new Broadcaster();
    }

    beforeEach(() => {
      const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);

      // We need to mock an actual jwt token here since this token is decoded by the servie to form legacry URL.
      mockAuthenticationService.getToken.and.returnValue(mockToken);
      mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: Logger, useValue: mockLogger },
          { provide: AuthenticationService, useValue: mockAuthenticationService },
          { provide: AUTH_API_URL, useValue: 'http://example.com/api/' },
          { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
          ProviderService
        ]
      });
      service = TestBed.get(ProviderService);
      controller = TestBed.get(HttpTestingController);
    });

    it('should get legacy linking url', () => {
      let val = service.getLegacyLinkingUrl('openshift-v3', 'testredirect');
      expect(val).toEqual('http://example.com/api/link/session?clientSession=TESTSESSION&sessionState=TESTSESSIONSTATE&redirect=testredirect&provider=openshift-v3');
    });

    it('should check github connection status', (done: DoneFn) => {
      const mockResponse = {
        username: 'some-github-user'
      };
      service.getGitHubStatus().subscribe(resp => {
        expect(resp).toBe(mockResponse);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/api/token?force_pull=true&for=https://github.com');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
      req.flush(mockResponse);
    });

    it('should check OSO connection status', (done: DoneFn) => {
      const mockResponse = {
        username: 'some-oso-user'
      };
      const cluster = 'some-cluster';
      service.getOpenShiftStatus(cluster).subscribe(resp => {
        expect(resp).toBe(mockResponse);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne(`http://example.com/api/token?force_pull=true&for=${cluster}`);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${mockToken}`);
      req.flush(mockResponse);
    });
});
