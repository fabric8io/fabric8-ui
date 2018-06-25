import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  HttpModule,
  RequestMethod,
  Response,
  ResponseOptions,
  ResponseType,
  XHRBackend
} from '@angular/http';
import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import { createMock } from 'testing/mock';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import {
  Application,
  DeploymentApiService,
  EnvironmentStat,
  MultiTimeseriesData,
  TimeseriesData
} from './deployment-api.service';

type TestContext = {
  service: DeploymentApiService;
  backend: MockBackend;
};

describe('DeploymentApiService', () => {

  beforeEach(function(this: TestContext): void {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: XHRBackend, useClass: MockBackend
        },
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
    this.backend = TestBed.get(XHRBackend);
    this.service = TestBed.get(DeploymentApiService);
  });

  describe('#getEnvironments', () => {
    it('should return result', function(this: TestContext, done: DoneFn): void {
      const httpResponse = {
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
        ]
      };
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId/environments');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      this.service.getEnvironments('foo spaceId')
        .subscribe((envs: EnvironmentStat[]): void => {
          expect(envs as any[]).toEqual(httpResponse.data);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId/environments');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.getEnvironments('foo spaceId')
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('#getApplications', () => {
    it('should return result', function(this: TestContext, done: DoneFn): void {
      const httpResponse = {
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
      };
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      this.service.getApplications('foo spaceId')
        .subscribe((apps: Application[]): void => {
          expect(apps as any[]).toEqual(httpResponse.data.attributes.applications);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.getApplications('foo spaceId')
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('#getTimeseriesData', () => {
    it('should return result', function(this: TestContext, done: DoneFn): void {
      const httpResponse = {
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
      };
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/statseries?start=1&end=2';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      this.service.getTimeseriesData('foo spaceId', 'stage env', 'foo appId', 1, 2)
        .subscribe((data: MultiTimeseriesData): void => {
          expect(data).toEqual(httpResponse.data);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/statseries?start=1&end=2';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.getTimeseriesData('foo spaceId', 'stage env', 'foo appId', 1, 2)
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('#getLatestTimeseriesData', () => {
    it('should return result', function(this: TestContext, done: DoneFn): void {
      const httpResponse = {
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
      };
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/stats';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      this.service.getLatestTimeseriesData('foo spaceId', 'stage env', 'foo appId')
        .subscribe((data: TimeseriesData): void => {
          expect(data).toEqual(httpResponse.data.attributes);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/stats';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.getLatestTimeseriesData('foo spaceId', 'stage env', 'foo appId')
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('#deleteDeployment', () => {
    it('should return response', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Delete);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
      });
      this.service.deleteDeployment('foo spaceId', 'stage env', 'foo appId')
        .subscribe((resp: Response): void => {
          expect(resp.status).toEqual(200);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Delete);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.deleteDeployment('foo spaceId', 'stage env', 'foo appId')
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });

  describe('#scalePods', () => {
    it('should return response', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Put);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env?podCount=5';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
      });
      this.service.scalePods('foo spaceId', 'stage env', 'foo appId', 5)
        .subscribe((resp: Response): void => {
          expect(resp.status).toEqual(200);
          done();
        });
    });

    it('should report errors', function(this: TestContext, done: DoneFn): void {
      this.backend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Put);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env?podCount=5';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockError(new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })) as Response & Error);
      });

      this.service.scalePods('foo spaceId', 'stage env', 'foo appId', 5)
      .subscribe(
        (resp) => done.fail('should throw error'),
        () => {
          expect(TestBed.get(ErrorHandler).handleError).toHaveBeenCalled();
          expect(TestBed.get(Logger).error).toHaveBeenCalled();
          done();
        }
      );
    });
  });
});
