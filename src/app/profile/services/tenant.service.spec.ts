import { TestBed } from '@angular/core/testing';
import { HttpModule, RequestMethod, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { createMock } from '../../../testing/mock';
import { TenantService } from './tenant.service';


describe('TenantService', () => {

  let service: TenantService;
  let mockBackend: MockBackend;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        { provide: Logger, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: UserService, useValue: mockUserService },
        { provide: WIT_API_URL, useValue: 'http://example.com' },
        TenantService
      ]
    });
    service = TestBed.get(TenantService);
    mockBackend = TestBed.get(XHRBackend);
  });

  describe('#updateTenant', () => {
    it('should make a HTTP PATCH request', (done: DoneFn) => {
      let mockResponse = 'mock-response';
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toBe(RequestMethod.Patch);
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockResponse
          })
        ));
      });
      service.updateTenant()
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
