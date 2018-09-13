import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { Che } from './che';
import { CheService } from './che.service';

describe('CheService', () => {

  type TestContext = {
    service: CheService;
    controller: HttpTestingController;
  };

  beforeEach(function(this: TestContext): void {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        CheService,
        {
          provide: WIT_API_URL,
          useValue: 'https://example.com/api/'
        },
        {
          provide: Logger,
          useFactory: (): jasmine.SpyObj<Logger> => createMock(Logger)
        },
        {
          provide: AuthenticationService,
          useFactory: (): jasmine.SpyObj<AuthenticationService> => {
            const svc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            svc.getToken.and.returnValue('mock-auth-token');
            return svc;
          }
        }
      ]
    });
    this.service = TestBed.get(CheService);
    this.controller = TestBed.get(HttpTestingController);
  });

  it('should be instantiable', function(this: TestContext): void {
    expect(this.service).toBeDefined();
  });

  describe('#getState', () => {
    it('should send an Authorization header', function(this: TestContext, done: DoneFn): void {
      this.service
        .getState().pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/che/state');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send a GET', function(this: TestContext, done: DoneFn): void {
      this.service
        .getState().pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/che/state');
      expect(req.request.method).toEqual('GET');
      req.flush({});
    });

    it('should return correct data', function(this: TestContext, done: DoneFn): void {
      const che: Che = {
        clusterFull: false,
        multiTenant: false,
        running: true
      };
      this.service
        .getState().pipe(
        first())
        .subscribe((c: Che): void => {
          expect(c).toEqual(che);
          this.controller.verify();
          done();
        });
      this.controller.expectOne('https://example.com/api/codebases/che/state').flush(che);
    });

    it('should handle errors', function(this: TestContext, done: DoneFn): void {
      TestBed.get(Logger).error.and.stub();
      this.service
        .getState()
        .subscribe(
          () => done.fail('should have received an error'),
          (err: any): void => {
            const errorMessage: string = 'Http failure response for https://example.com/api/codebases/che/state: 0 ';
            expect(err).toEqual(errorMessage);
            const httpErrorResponse: HttpErrorResponse = TestBed.get(Logger).error.calls.first().args[0];
            expect(httpErrorResponse.message).toEqual(errorMessage);
            this.controller.verify();
            done();
          }
        );
      this.controller.expectOne('https://example.com/api/codebases/che/state').error(new ErrorEvent('some error'));
    });
  });

  describe('#start', () => {
    it('should send an Authorization header', function(this: TestContext, done: DoneFn): void {
      this.service
        .start().pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/che/start');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send a PATCH', function(this: TestContext, done: DoneFn): void {
      this.service
        .start().pipe(
        first())
        .subscribe((): void => {
          this.controller.verify();
          done();
        });
      const req: TestRequest = this.controller.expectOne('https://example.com/api/codebases/che/start');
      expect(req.request.method).toEqual('PATCH');
      req.flush({});
    });

    it('should return correct data', function(this: TestContext, done: DoneFn): void {
      const che: Che = {
        clusterFull: false,
        multiTenant: false,
        running: true
      };
      this.service
        .start().pipe(
        first())
        .subscribe((c: Che): void => {
          expect(c).toEqual(che);
          this.controller.verify();
          done();
        });
      this.controller.expectOne('https://example.com/api/codebases/che/start').flush(che);
    });

    it('should handle errors', function(this: TestContext, done: DoneFn): void {
      TestBed.get(Logger).error.and.stub();
      this.service
        .start()
        .subscribe(
          () => done.fail('should have received an error'),
          (err: any): void => {
            const errorMessage: string = 'Http failure response for https://example.com/api/codebases/che/start: 0 ';
            expect(err).toEqual(errorMessage);
            const httpErrorResponse: HttpErrorResponse = TestBed.get(Logger).error.calls.first().args[0];
            expect(httpErrorResponse.message).toEqual(errorMessage);
            this.controller.verify();
            done();
          }
        );
      this.controller.expectOne('https://example.com/api/codebases/che/start').error(new ErrorEvent('some error'));
    });
  });

});
