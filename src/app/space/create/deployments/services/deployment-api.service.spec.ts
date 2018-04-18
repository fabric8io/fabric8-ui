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
import {
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import { createMock } from 'testing/mock';

import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import {
  Application,
  DeploymentApiService,
  EnvironmentStat,
  MultiTimeseriesData,
  TimeseriesData
} from './deployment-api.service';

describe('DeploymentApiService', () => {
  let mockBackend: MockBackend;
  let svc: DeploymentApiService;

  beforeEach(() => {
    const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthService.getToken.and.returnValue('mock-auth-token');

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: XHRBackend, useClass: MockBackend
        },
        {
          provide: AuthenticationService, useValue: mockAuthService
        },
        {
          provide: WIT_API_URL, useValue: 'http://example.com/'
        },
        DeploymentApiService
      ]
    });
    mockBackend = TestBed.get(XHRBackend);
    svc = TestBed.get(DeploymentApiService);
  });

  describe('#getEnvironments', () => {
    it('should return result', (done: DoneFn): void => {
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
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId/environments');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      svc.getEnvironments('foo spaceId')
        .subscribe((envs: EnvironmentStat[]): void => {
          expect(envs as any[]).toEqual(httpResponse.data);
          done();
        });
    });
  });

  describe('#getApplications', () => {
    it('should return result', (done: DoneFn): void => {
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
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('http://example.com/deployments/spaces/foo%20spaceId');
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      svc.getApplications('foo spaceId')
        .subscribe((apps: Application[]): void => {
          expect(apps as any[]).toEqual(httpResponse.data.attributes.applications);
          done();
        });
    });
  });

  describe('#getTimeseriesData', () => {
    it('should return result', (done: DoneFn): void => {
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
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/statseries?start=1&end=2';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      svc.getTimeseriesData('foo spaceId', 'stage env', 'foo appId', 1, 2)
        .subscribe((data: MultiTimeseriesData): void => {
          expect(data).toEqual(httpResponse.data);
          done();
        });
    });
  });

  describe('#getLatestTimeseriesData', () => {
    it('should return result', (done: DoneFn): void => {
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
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env/stats';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ body: httpResponse })));
      });
      svc.getLatestTimeseriesData('foo spaceId', 'stage env', 'foo appId')
        .subscribe((data: TimeseriesData): void => {
          expect(data).toEqual(httpResponse.data.attributes);
          done();
        });
    });
  });

  describe('#deleteDeployment', () => {
    it('should return response', (done: DoneFn): void => {
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Delete);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
      });
      svc.deleteDeployment('foo spaceId', 'stage env', 'foo appId')
        .subscribe((resp: Response): void => {
          expect(resp.status).toEqual(200);
          done();
        });
    });
  });

  describe('#scalePods', () => {
    it('should return response', (done: DoneFn): void => {
      mockBackend.connections.first().subscribe((connection: MockConnection): void => {
        expect(connection.request.method).toEqual(RequestMethod.Put);
        const expectedUrl: string = 'http://example.com/deployments/spaces/foo%20spaceId/applications/foo%20appId/deployments/stage%20env?podCount=5';
        expect(connection.request.url).toEqual(expectedUrl);
        expect(connection.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
      });
      svc.scalePods('foo spaceId', 'stage env', 'foo appId', 5)
        .subscribe((resp: Response): void => {
          expect(resp.status).toEqual(200);
          done();
        });
    });
  });

});
