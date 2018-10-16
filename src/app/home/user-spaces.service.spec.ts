import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';

import { createMock } from 'testing/mock';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import {
  UserSpacesResponse,
  UserSpacesService
} from './user-spaces.service';

describe('UserSpacesService', () => {

  let service: UserSpacesService;
  let controller: HttpTestingController;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: AuthenticationService, useFactory: (): AuthenticationService => {
            const authSvc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            authSvc.getToken.and.returnValue('mock-auth-token');
            return authSvc;
          }
        },
        {
          provide: ErrorHandler, useFactory: (): ErrorHandler => {
            const handler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
            handler.handleError.and.stub();
            return handler;
          }
        },
        {
          provide: Logger, useFactory: (): Logger => {
            const logger: jasmine.SpyObj<Logger> = createMock(Logger);
            logger.error.and.stub();
            return logger;
          }
        },
        {
          provide: WIT_API_URL, useValue: 'http://example.com/'
        },
        UserSpacesService
      ]
    });
    service = TestBed.get(UserSpacesService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('#getInvolvedSpacesCount', (): void => {
    it('should return 0 result based on totalCount', (done: DoneFn): void => {
      const httpResponse: UserSpacesResponse = {
        data: [],
        meta: {
          totalCount: 0
        }
      };
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe((count: number): void => {
        expect(count).toEqual(httpResponse.meta.totalCount);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should return non-0 result based on totalCount', (done: DoneFn): void => {
      const httpResponse: UserSpacesResponse = {
        data: [],
        meta: {
          totalCount: 5
        }
      };
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe((count: number): void => {
        expect(count).toEqual(httpResponse.meta.totalCount);
        controller.verify();
        done();
      });

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', (done: DoneFn): void => {
      service.getInvolvedSpacesCount().pipe(
        first()
      ).subscribe(
        (count: number): void => {
          expect(count).toEqual(0);
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        },
        (): void => {
          done.fail('should continue with 0 value');
        }
      );

      const req: TestRequest = controller.expectOne('http://example.com/user/spaces');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

});
