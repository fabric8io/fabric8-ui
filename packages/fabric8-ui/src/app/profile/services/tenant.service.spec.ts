import { HttpResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { createMock } from '../../../testing/mock';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;
  let controller: HttpTestingController;
  let mockLogger: jasmine.SpyObj<Logger>;

  beforeEach(() => {
    const mockAuthenticationService: jasmine.SpyObj<AuthenticationService> = createMock(
      AuthenticationService,
    );
    mockAuthenticationService.getToken.and.returnValue('mock-token');
    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Logger, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        { provide: WIT_API_URL, useValue: 'http://example.com/api/' },
        TenantService,
      ],
    });
    service = TestBed.get(TenantService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('#getTenant', () => {
    it('should make a HTTP GET request', (done: DoneFn) => {
      let mockResponse = 'mock-response';

      service.getTenant().subscribe(
        (resp: any) => {
          expect(resp).toEqual(mockResponse);
          controller.verify();
          done();
        },
        (err: string) => {
          done.fail(err);
        },
      );

      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
      req.flush({ data: mockResponse });
    });

    it('should delegate to handleError() if an error occurs', (done: DoneFn) => {
      service.getTenant().subscribe(
        (resp: any) => {
          done.fail(resp);
        },
        () => {
          // handleError() is private, verify that logger.error() is called with returned error
          expect(mockLogger.error).toHaveBeenCalled();
          controller.verify();
          done();
        },
      );
      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#updateTenant', () => {
    it('should make a HTTP PATCH request', (done: DoneFn) => {
      let mockResponse = 'mock-response';

      service.updateTenant().subscribe(
        (resp: HttpResponse<any>) => {
          expect(resp.body).toEqual(mockResponse);
          controller.verify();
          done();
        },
        (err: string) => {
          done.fail(err);
        },
      );

      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
      req.flush(mockResponse);
    });

    it('should delegate to handleError() if an error occurs', (done: DoneFn) => {
      service.updateTenant().subscribe(
        (resp: HttpResponse<any>) => {
          done.fail(resp.body);
        },
        () => {
          // handleError() is private, verify that logger.error() is called with returned error
          expect(mockLogger.error).toHaveBeenCalled();
          controller.verify();
          done();
        },
      );
      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#cleanupTenant', () => {
    it('should make a HTTP DELETE request', (done: DoneFn) => {
      service.cleanupTenant().subscribe(
        (): void => {
          controller.verify();
          done();
        },
      );

      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-token');
      req.flush('');
    });

    it('should delegate to handleError() if an error occurs', (done: DoneFn) => {
      service.cleanupTenant().subscribe(
        () => done.fail('Should throw error'),
        () => {
          // handleError() is private, verify that logger.error() is called with returned error
          expect(mockLogger.error).toHaveBeenCalled();
          controller.verify();
          done();
        },
      );
      const req: TestRequest = controller.expectOne('http://example.com/api/user/services');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });
});
