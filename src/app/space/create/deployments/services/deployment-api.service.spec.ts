import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import {
  Application,
  ApplicationsResponse,
  DeploymentApiService,
  EnvironmentsResponse,
  EnvironmentStat,
  MultiTimeseriesData,
  MultiTimeseriesResponse,
  PodQuotaRequirement,
  PodQuotaRequirementResponse,
  TimeseriesData,
  TimeseriesResponse
} from './deployment-api.service';

describe('DeploymentApiService', () => {

  let service: DeploymentApiService;
  let controller: HttpTestingController;

  beforeEach(function(): void {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: AuthenticationService, useFactory: (): jasmine.SpyObj<AuthenticationService> => {
            const authSvc: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
            authSvc.getToken.and.returnValue('mock-auth-token');
            return authSvc;
          }
        },
        {
          provide: ErrorHandler, useFactory: (): jasmine.SpyObj<ErrorHandler> => {
            const handler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
            handler.handleError.and.stub();
            return handler;
          }
        },
        {
          provide: Logger, useFactory: (): jasmine.SpyObj<Logger> => {
            const logger: jasmine.SpyObj<Logger> = createMock(Logger);
            logger.error.and.stub();
            return logger;
          }
        },
        {
          provide: WIT_API_URL, useValue: 'http://example.com/'
        },
        DeploymentApiService
      ]
    });
    service = TestBed.get(DeploymentApiService);
    controller = TestBed.get(HttpTestingController);
  });

  describe('#getEnvironments', (): void => {
    it('should return result', function(done: DoneFn): void {
      const httpResponse: EnvironmentsResponse = {
        data: [
          {
            attributes: {
              name: 'stage'
            },
            id: 'fooId',
            type: 'fooType'
          },
          {
            attributes: {
              name: 'run'
            },
            id: 'barId',
            type: 'barType'
          }
        ] as EnvironmentStat[]
      };
      service.getEnvironments('foo spaceId').pipe(
        first()
      ).subscribe((envs: EnvironmentStat[]): void => {
          expect(envs).toEqual(httpResponse.data);
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/environments');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', function(done: DoneFn): void {
      service.getEnvironments('foo spaceId').pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/environments');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#getApplications', (): void => {
    it('should return result', function(done: DoneFn): void {
      const httpResponse: ApplicationsResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello'
                }
              },
              {
                attributes: {
                  name: 'vertx-paint'
                }
              },
              {
                attributes: {
                  name: 'vertx-wiki'
                }
              }
            ]
          }
        }
      } as ApplicationsResponse;
      service.getApplications('foo spaceId').pipe(
        first()
      ).subscribe((apps: Application[]): void => {
          expect(apps).toEqual(httpResponse.data.attributes.applications);
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', function(done: DoneFn): void {
      service.getApplications('foo spaceId').pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#getTimeseriesData', (): void => {
    it('should return result', function(done: DoneFn): void {
      const httpResponse: MultiTimeseriesResponse = {
        data: {
          cores: [
            { value: 1, time: 1 },
            { value: 2, time: 2 }
          ],
          memory: [
            { value: 3, time: 3 },
            { value: 4, time: 4 }
          ],
          net_rx: [
            { value: 5, time: 5 },
            { value: 6, time: 6 }
          ],
          net_tx: [
            { value: 7, time: 7 },
            { value: 8, time: 8 }
          ],
          start: 1,
          end: 2
        }
      } as MultiTimeseriesResponse;
      service.getTimeseriesData('foo spaceId', 'stage env', 'foo appId', 1, 2).pipe(
        first()
      ).subscribe((data: MultiTimeseriesData): void => {
          expect(data).toEqual(httpResponse.data);
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/statseries?start=1&end=2');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', function(done: DoneFn): void {
      service.getTimeseriesData('foo spaceId', 'stage env', 'foo appId', 1, 2).pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/statseries?start=1&end=2');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#getLatestTimeseriesData', () => {
    it('should return result', function(done: DoneFn): void {
      const httpResponse: TimeseriesResponse = {
        data: {
          attributes: {
            cores: {
              time: 9, value: 9
            },
            memory: {
              time: 10, value: 10
            },
            net_tx: {
              time: 11, value: 11
            },
            net_rx: {
              time: 12, value: 12
            }
          }
        }
      } as TimeseriesResponse;
      service.getLatestTimeseriesData('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe((data: TimeseriesData): void => {
          expect(data).toEqual(httpResponse.data.attributes);
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/stats');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', function(done: DoneFn): void {
      service.getLatestTimeseriesData('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/stats');
      req.error(new ErrorEvent('Mock HTTP error'));
    });
  });

  describe('#deleteDeployment', () => {
    it('should return response', function(done: DoneFn): void {
      service.deleteDeployment('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe((): void => {
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env');
      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush('');
    });

    it('should report errors', function(done: DoneFn): void {
      service.deleteDeployment('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  describe('#scalePods', () => {
    it('should return response', function(done: DoneFn): void {
      service.scalePods('foo spaceId', 'stage env', 'foo appId', 5).pipe(
        first()
      ).subscribe((): void => {
          controller.verify();
          done();
        });

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env?podCount=5');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush('');
    });

    it('should report errors', function(done: DoneFn): void {
      service.scalePods('foo spaceId', 'stage env', 'foo appId', 5).pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            controller.verify();
            done();
          }
        );

      const req: TestRequest = controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env?podCount=5');
      req.error(new ErrorEvent('Mock HTTP Error'));
    });
  });

  // TODO uncomment once backend is available and implementation is updated
  xdescribe('#getQuotaRequirementPerPod', () => {
    it('should return result', function(this: TestContext, done: DoneFn): void {
      const gb: number = Math.pow(1024, 3);
      const httpResponse: PodQuotaRequirementResponse = {
        data: {
          limits: {
            cpucores: 1,
            memory: 0.5 * gb
          }
        }
      } as PodQuotaRequirementResponse;
      this.service.getQuotaRequirementPerPod('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe((data: PodQuotaRequirement): void => {
          expect(data).toEqual(httpResponse.data.limits);
          this.controller.verify();
          done();
        });

      const req: TestRequest = this.controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/podlimits');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush(httpResponse);
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.service.getQuotaRequirementPerPod('foo spaceId', 'stage env', 'foo appId').pipe(
        first()
      ).subscribe(
          () => done.fail('should throw error'),
          () => {
            expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
            expect(TestBed.get(Logger).error).toHaveBeenCalled();
            this.controller.verify();
            done();
          }
        );

      const req: TestRequest = this.controller.expectOne('http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/podlimits');
      req.error(new ErrorEvent('Mock HTTP error'));
    });
  });

});
