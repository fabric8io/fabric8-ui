import { TestBed } from '@angular/core/testing';
import { HttpModule, RequestMethod, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { HttpResponse } from '@angular/common/http';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { createMock } from '../../../testing/mock';
import { TenantService } from './tenant.service';


describe('TenantService', () => {

  let service: TenantService;
  let controller: HttpTestingController;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Logger, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: UserService, useValue: mockUserService },
        { provide: WIT_API_URL, useValue: 'http://example.com' },
        TenantService
      ]
    });
    service = TestBed.get(TenantService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('#updateTenant', () => {
    fit('should make a HTTP PATCH request', (done: DoneFn) => {
      let mockResponse = 'mock-response';

      service.updateTenant()
        .subscribe(
          (resp: HttpResponse) => {
            expect(resp.text()).toEqual(mockResponse);
            controller.verify();
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
      req.flush(mockResponse);
    });

    it('should delegate to handleError() if an error occurs', (done: DoneFn) => {
      let mockError: Error = new Error();
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(mockError);
      });
      service.updateTenant()
        .subscribe(
          (msg: string) => {
            done.fail(msg);
          },
          (err: string) => {
            // handleError() is private, verify that logger.error() is called with returned error
            expect(mockLogger.error).toHaveBeenCalledWith(mockError);
            subscription.unsubscribe();
            done();
          }
        );
    });
  });

  describe('#cleanupTenant', () => {
    it('should make a HTTP DELETE request', (done: DoneFn) => {
      let mockResponse = 'mock-response';
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Delete);
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockResponse
          })
        ));
      });
      service.cleanupTenant()
        .subscribe(
          (msg: Response) => {
            expect(msg.text()).toEqual(mockResponse);
            subscription.unsubscribe();
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    it('should delegate to handleError() if an error occurs', (done: DoneFn) => {
      let mockError: Error = new Error('mock-error');
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(mockError);
      });
      service.cleanupTenant()
        .subscribe(
          (msg: string) => {
            done.fail(msg);
          },
          (err: string) => {
            // handleError() is private, verify that logger.error() is called with returned error
            expect(mockLogger.error).toHaveBeenCalledWith(mockError);
            subscription.unsubscribe();
            done();
          }
        );
    });
  });

});
