import {
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';

import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';

import { createMock } from 'testing/mock';

import {
  Observable,
  Subscription
} from 'rxjs';

import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import {
  Application,
  DeploymentsService
} from './deployments.service';

describe('DeploymentsService', () => {

  let mockBackend: MockBackend;
  let svc: DeploymentsService;

  beforeEach(() => {
    const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthService.getToken.and.returnValue('mock-auth-token');

    TestBed.configureTestingModule({
      imports: [ HttpModule ],
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
        DeploymentsService
      ]
    });
    svc = TestBed.get(DeploymentsService);
    mockBackend = TestBed.get(XHRBackend);
  });

  function doMockHttpTest<U>(response: any, expected: U, obs: Observable<U>, done?: DoneFn): void {
    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    obs.subscribe((data: U) => {
      expect(data).toEqual(expected);
      subscription.unsubscribe();
      if (done) {
        done();
      }
    });
  }

  describe('#getApplications', () => {
    it('should publish faked application names', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            { name: 'vertx-hello' }, { name: 'vertx-paint' }, { name: 'vertx-wiki' }
          ]
        }
      };
      doMockHttpTest(expectedResponse, expectedResponse.data.applications.map(app => app.name),
        svc.getApplications('foo-spaceId'), done);
    });

    it('should return empty array for null applications response', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: null
        }
      };
      doMockHttpTest(expectedResponse, [], svc.getApplications('foo-spaceId'), done);
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', (done: DoneFn) => {
      const expectedResponse = {
        data: [
          { name: 'stage' }, { name: 'run' }, { name: 'test' }
        ]
      };
      doMockHttpTest(expectedResponse, expectedResponse.data, svc.getEnvironments('foo-spaceId'), done);
    });

    it('should return empty array for null environments response', (done: DoneFn) => {
      const expectedResponse = {
        data: null
      };
      doMockHttpTest(expectedResponse, [], svc.getEnvironments('foo-spaceId'), done);
    });
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for included deployments', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'run'
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, true,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'run'), done);
    });

    it('should be false for excluded deployments', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'run'
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
    });

    it('should be false if no deployments', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [ ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
    });

    it('should be false if deployments is null', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: null
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
    });
  });

  describe('#isDeployedInEnvironment', () => {
    it('should be true for included environments', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'run'
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, true, svc.isDeployedInEnvironment('foo-spaceId', 'run'), done);
    });

    it('should be false for excluded environments', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'run'
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if no environments are deployed', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [ ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if no applications exist', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [ ]
        }
      };
      doMockHttpTest(expectedResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if applications are null', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: null
        }
      };
      doMockHttpTest(expectedResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if pipeline is null', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: null
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'stage',
                  version: '1.0.2'
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, expectedResponse.data.applications[0].pipeline[0].version,
        svc.getVersion('foo-spaceId', 'vertx-hello', 'stage'), done);
    });
  });

  describe('#getDeploymentCpuStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
      const timeseriesResponse = {
        data: {
          cores: {
            time: 1,
            value: 2
          }
        }
      };
      const deploymentResponse = {
        data: {
          applications: [
            {
              name: 'foo-app',
              pipeline: [
                {
                  name: 'foo-env'
                }
              ]
            }
          ]
        }
      };
      const quotaResponse = {
        data: [{
          name: 'foo-env',
          quota: {
            cpucores: {
              quota: 3,
              used: 4
            }
          }
        }]
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/apps\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/apps\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (timeseriesRegex.test(requestUrl)) {
          responseBody = timeseriesResponse;
        } else if (deploymentRegex.test(requestUrl)) {
          responseBody = deploymentResponse;
        } else {
          responseBody = quotaResponse;
        }
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(responseBody),
            status: 200
          })
        ));
      });

      svc.getDeploymentCpuStat('foo-space', 'foo-app', 'foo-env')
        .subscribe((stat: CpuStat) => {
          expect(stat).toEqual({ used: 2, quota: 3 });
          subscription.unsubscribe();
          done();
        });
    });
  });

  describe('#getDeploymentMemoryStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
      const timeseriesResponse = {
        data: {
          memory: {
            time: 1,
            value: 2
          }
        }
      };
      const deploymentResponse = {
        data: {
          applications: [
            {
              name: 'foo-app',
              pipeline: [
                {
                  name: 'foo-env'
                }
              ]
            }
          ]
        }
      };
      const quotaResponse = {
        data: [{
          name: 'foo-env',
          quota: {
            memory: {
              quota: 3,
              used: 4
            }
          }
        }]
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/apps\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/apps\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (timeseriesRegex.test(requestUrl)) {
          responseBody = timeseriesResponse;
        } else if (deploymentRegex.test(requestUrl)) {
          responseBody = deploymentResponse;
        } else {
          responseBody = quotaResponse;
        }
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(responseBody),
            status: 200
          })
        ));
      });

      svc.getDeploymentMemoryStat('foo-space', 'foo-app', 'foo-env')
        .subscribe((stat: MemoryStat) => {
          expect(stat).toEqual(new ScaledMemoryStat(2, 3));
          subscription.unsubscribe();
          done();
        });
    });
  });

  describe('#getEnvironmentCpuStat', () => {
    it('should return a "used" value of 8 and a "quota" value of 10', (done: DoneFn) => {
      const expectedResponse = {
        data: [{
          name: 'stage',
          quota: {
            cpucores: {
              quota: 10,
              used: 8
            }
          }
        }]
      };
      doMockHttpTest(expectedResponse, expectedResponse.data[0].quota.cpucores,
        svc.getEnvironmentCpuStat('foo-spaceId', 'stage'), done);
    });
  });

  describe('#getEnvironmentMemoryStat', () => {
    it('should return a "used" value of 512 and a "quota" value of 1024 with units in "MB"', (done: DoneFn) => {
      const GB = Math.pow(1024, 3);
      const expectedResponse = {
        data: [{
          name: 'stage',
          quota: {
            memory: {
              used: 0.5 * GB,
              quota: 1 * GB,
              units: 'bytes'
            }
          }
        }]
      };
      doMockHttpTest(expectedResponse, new ScaledMemoryStat(0.5 * GB, 1 * GB),
        svc.getEnvironmentMemoryStat('foo-spaceId', 'stage'), done);
    });
  });

  describe('#getDeploymentNetworkStat', () => {
    it('should return a "sent" value between 0 and 100', fakeAsync(() => {
      svc.getDeploymentNetworkStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.sent).toBeGreaterThanOrEqual(0);
          expect(val.sent).toBeLessThanOrEqual(100);
        });
        tick(DeploymentsService.POLL_RATE_MS + 10);
        discardPeriodicTasks();
    }));

    it('should return a "received" value between 0 and 100', fakeAsync(() => {
      svc.getDeploymentNetworkStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.received).toBeGreaterThanOrEqual(0);
          expect(val.received).toBeLessThanOrEqual(100);
        });
        tick(DeploymentsService.POLL_RATE_MS + 10);
        discardPeriodicTasks();
    }));
  });

  describe('#getPods', () => {
    it('should return pods array', (done: DoneFn) => {
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello',
              pipeline: [
                {
                  name: 'stage',
                  pods: {
                    total: 6,
                    running: 1,
                    starting: 2,
                    stopping: 3
                  }
                }
              ]
            }
          ]
        }
      };
      doMockHttpTest(expectedResponse, {
        total: 6,
        pods: [
          [ 'Running', 1 ],
          [ 'Starting', 2 ],
          [ 'Stopping', 3 ]
        ]
      },
        svc.getPods('foo-spaceId', 'vertx-hello', 'stage'), done);
    });
  });

});
