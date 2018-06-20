import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  HttpModule,
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

import {
  Observable,
  Subject,
  Subscription,
  VirtualTimeScheduler
} from 'rxjs';
import { VirtualAction } from 'rxjs/scheduler/VirtualTimeScheduler';

import {
  Logger,
  Notification,
  NotificationType
} from 'ngx-base';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetStat } from '../models/scaled-net-stat';
import {
  Application,
  DeploymentApiService
} from './deployment-api.service';
import {
  DeploymentsService,
  POLL_RATE_TOKEN,
  TIMER_TOKEN,
  TIMESERIES_SAMPLES_TOKEN
} from './deployments.service';

interface MockHttpParams<U> {
  url: string;
  response: { data: {} } | Response;
  expected?: U;
  expectedError?: any;
  observable: Observable<U>;
  done: DoneFn;
}

describe('DeploymentsService', () => {

  let serviceUpdater: Subject<void>;
  let mockBackend: MockBackend;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandler>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let svc: DeploymentsService;

  beforeEach(() => {
    serviceUpdater = new Subject<void>();

    const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthService.getToken.and.returnValue('mock-auth-token');

    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
    mockErrorHandler = jasmine.createSpyObj<ErrorHandler>('ErrorHandler', ['handleError']);
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);

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
        {
          provide: Logger, useValue: mockLogger
        },
        {
          provide: ErrorHandler, useValue: mockErrorHandler
        },
        {
          provide: NotificationsService, useValue: mockNotificationsService
        },
        {
          provide: TIMER_TOKEN, useValue: serviceUpdater
        },
        {
          provide: TIMESERIES_SAMPLES_TOKEN, useValue: 3
        },
        {
          provide: POLL_RATE_TOKEN, useValue: 1
        },
        DeploymentApiService,
        DeploymentsService
      ]
    });
    svc = TestBed.get(DeploymentsService);
    spyOn(svc, 'getPodsQuota').and.callThrough();
    mockBackend = TestBed.get(XHRBackend);
  });

  function doMockHttpTest<U>(params: MockHttpParams<U>): void {
    if (params.expected !== undefined && params.expectedError !== undefined) {
      throw 'Cannot have both expected value and expected error';
    }
    if (params.expected === undefined && params.expectedError === undefined) {
      throw 'Must have either an expected value or an expected error';
    }

    let response: Response;
    if (params.response instanceof Response) {
      response = params.response;
    } else {
      response = new Response(new ResponseOptions({ body: params.response }));
    }

    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      const unexpectedEmissionHandler = (v: any) => {
        subscription.unsubscribe();
        params.done.fail(JSON.stringify(v));
      };
      const testBody = (expected: U, actual: U) => {
        subscription.unsubscribe();
        expect(connection.request.url).toEqual(params.url);
        expect(actual).toEqual(expected);
        params.done();
      };

      if (params.expected !== undefined) {
        connection.mockRespond(response);
        params.observable.subscribe(
          (data: U) => testBody(params.expected, data),
          unexpectedEmissionHandler
        );
      } else if (params.expectedError !== undefined) {
        connection.mockError(response as Response & Error);
        params.observable.subscribe(
          unexpectedEmissionHandler,
          (err: any) => testBody(params.expectedError, err)
        );
      }
    });
    serviceUpdater.next();
  }


  describe('#getDeploymentNetworkStat', () => {
    it('should return scaled timeseries data', (done: DoneFn) => {
      const initialTimeseriesResponse = {
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
          end: 8
        }
      };
      const streamingTimeseriesResponse = {
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
      const deploymentResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env',
                        pods: [['Running', '1']],
                        pod_total: 1
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const initialTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/statseries\?start=\d+&end=\d+$/;
        const streamingTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (initialTimeseriesRegex.test(requestUrl)) {
          responseBody = initialTimeseriesResponse;
        } else if (streamingTimeseriesRegex.test(requestUrl)) {
          responseBody = streamingTimeseriesResponse;
        } else if (deploymentRegex.test(requestUrl)) {
          responseBody = deploymentResponse;
        }
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(responseBody),
            status: 200
          })
        ));
      });

      svc.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: NetworkStat[]) => {
          expect(stats).toEqual([
            { sent: new ScaledNetStat(7, 7), received: new ScaledNetStat(5, 5) },
            { sent: new ScaledNetStat(8, 8), received: new ScaledNetStat(6, 6) },
            { sent: new ScaledNetStat(11, 11), received: new ScaledNetStat(12, 12) }
          ]);
          subscription.unsubscribe();
          done();
        });
      serviceUpdater.next();
      serviceUpdater.next();

      it('should have queried the pods quota with the correct arguments', () => {
        expect(svc.getPodsQuota).toHaveBeenCalledWith('foo-space', 'foo-env', 'foo-app');
      });
    });

    it('should scale results to the sample with greatest unit', (done: DoneFn) => {
      const initialTimeseriesResponse = {
        data: {
          cores: [
            { value: 0, time: 0 },
            { value: 0, time: 1 }
          ],
          net_rx: [
            { value: 800 * Math.pow(1024, 1), time: 0 },
            { value: 1.2 * Math.pow(1024, 2), time: 1 }
          ],
          net_tx: [
            { value: 500 * Math.pow(1024, 2), time: 0 },
            { value: 1.2 * Math.pow(1024, 3), time: 1 }
          ],
          memory: [
            { value: 0, time: 0 },
            { value: 0, time: 1 }
          ],
          start: 0,
          end: 1
        }
      };
      const streamingTimeseriesResponse = {
        data: {
          attributes: {
            cores: {
              time: 0, value: 0
            },
            net_tx: {
              time: 2, value: 1 * Math.pow(1024, 3)
            },
            net_rx: {
              time: 2, value: 750 * Math.pow(1024, 2)
            },
            memory: {
              time: 0, value: 0
            }
          }
        }
      };
      const deploymentResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env',
                        pods: [['Running', '1']],
                        pod_total: 1,
                        pods_quota: {
                          cpucores: 0,
                          memory: 0
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const initialTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/statseries\?start=\d+&end=\d+$/;
        const streamingTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (initialTimeseriesRegex.test(requestUrl)) {
          responseBody = initialTimeseriesResponse;
        } else if (streamingTimeseriesRegex.test(requestUrl)) {
          responseBody = streamingTimeseriesResponse;
        } else if (deploymentRegex.test(requestUrl)) {
          responseBody = deploymentResponse;
        }

        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(responseBody),
            status: 200
          })
        ));
      });

      svc.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: NetworkStat[]) => {
          expect(stats).toEqual([
            {
              sent: jasmine.objectContaining({ used: 0.5, units: MemoryUnit.GB }),
              received: jasmine.objectContaining({ used: 0, units: MemoryUnit.GB })
            },
            {
              sent: jasmine.objectContaining({ used: 1.2, units: MemoryUnit.GB }),
              received: jasmine.objectContaining({ used: 0, units: MemoryUnit.GB })
            },
            {
              sent: jasmine.objectContaining({ used: 1, units: MemoryUnit.GB }),
              received: jasmine.objectContaining({ used: 0.7, units: MemoryUnit.GB })
            }
          ] as any[]);
          subscription.unsubscribe();
          done();
        });
      serviceUpdater.next();
      serviceUpdater.next();
    });
  });

  describe('#getTimeseriesData', () => {
    it('should complete without errors if the deployment disappears', (done: DoneFn) => {
      const initialTimeseriesResponse = {
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
          end: 8
        }
      };
      const streamingTimeseriesResponse = {
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
      const initialDeploymentResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env',
                        pods_quota: {
                          cpucores: 3
                        },
                        pods: [['Running', '1']]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      const updatedDeploymentResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: []
                }
              }
            ]
          }
        }
      };

      let deploymentStatus: boolean = false;
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const initialTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/statseries\?start=\d+&end=\d+$/;
        const streamingTimeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (initialTimeseriesRegex.test(requestUrl)) {
          responseBody = initialTimeseriesResponse;
        } else if (streamingTimeseriesRegex.test(requestUrl)) {
          if (!deploymentStatus) {
            responseBody = streamingTimeseriesResponse;
          } else {
            connection.mockError(new Response(
              new ResponseOptions({
                body: 'Generic error message',
                status: 404
              })
            ) as Response & Error);
            return;
          }
        } else if (deploymentRegex.test(requestUrl) && !deploymentStatus) {
          responseBody = initialDeploymentResponse;
        } else if (deploymentRegex.test(requestUrl) && deploymentStatus) {
          responseBody = updatedDeploymentResponse;
        }

        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(responseBody),
            status: 200
          })
        ));
      });

      svc.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3)
        .takeUntil(Observable.timer(2000))
        .subscribe(
          (stat: NetworkStat[]): void => {
            deploymentStatus = true;
            serviceUpdater.next();
          },
          err => {
            done.fail(err.message || err);
            return Observable.empty();
          },
          () => {
            expect(mockLogger.error).not.toHaveBeenCalled();
            expect(mockNotificationsService.message).not.toHaveBeenCalled();
            expect(mockErrorHandler.handleError).not.toHaveBeenCalled();
            subscription.unsubscribe();
            done();
          }
        );
      serviceUpdater.next();
    });
  });

  describe('#getEnvironmentCpuStat', () => {
    it('should return a "used" value of 8 and a "quota" value of 10', (done: DoneFn) => {
      const httpResponse = {
        data: [{
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                quota: 10,
                used: 8
              }
            }
          }
        }]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: httpResponse.data[0].attributes.quota.cpucores,
        observable: svc.getEnvironmentCpuStat('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should encode url', (done: DoneFn) => {
      const httpResponse = {
        data: [{
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                quota: 10,
                used: 8
              }
            }
          }
        }]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId%2B/environments',
        response: httpResponse,
        expected: httpResponse.data[0].attributes.quota.cpucores,
        observable: svc.getEnvironmentCpuStat('foo-spaceId+', 'stage'),
        done: done
      });
    });
  });

  describe('#getEnvironmentMemoryStat', () => {
    it('should return a "used" value of 512 and a "quota" value of 1024 with units in "MB"', (done: DoneFn) => {
      const GB = Math.pow(1024, 3);
      const httpResponse = {
        data: [{
          attributes: {
            name: 'stage',
            quota: {
              memory: {
                used: 0.5 * GB,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: new ScaledMemoryStat(0.5 * GB, 1 * GB) as MemoryStat,
        observable: svc.getEnvironmentMemoryStat('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should encode url', (done: DoneFn) => {
      const GB = Math.pow(1024, 3);
      const httpResponse = {
        data: [{
          attributes: {
            name: 'stage',
            quota: {
              memory: {
                used: 0.5 * GB,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId%2B/environments',
        response: httpResponse,
        expected: new ScaledMemoryStat(0.5 * GB, 1 * GB) as MemoryStat,
        observable: svc.getEnvironmentMemoryStat('foo-spaceId+', 'stage'),
        done: done
      });
    });
  });

  describe('#deleteDeployment', () => {
    it('should delete a deployment with the correct URL', (done: DoneFn) => {
      const spaceId = 'someSpace-Id';
      const environmentId = 'some Stage';
      const appId = 'someApp Name';
      const encSpaceId = encodeURIComponent(spaceId);
      const encEnvironmentId = encodeURIComponent(environmentId);
      const encAppId = encodeURIComponent(appId);
      const expectedUrl = `http://example.com/deployments/spaces/${encSpaceId}/applications/${encAppId}/deployments/${encEnvironmentId}`;

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.url).toEqual(expectedUrl);
        connection.mockRespond(new Response(
          new ResponseOptions({ status: 200 })
        ));
      });

      svc.deleteDeployment(spaceId, environmentId, appId)
        .subscribe(
          (msg: string) => {
            expect(msg).toEqual('Deployment has successfully deleted');
            subscription.unsubscribe();
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    it('should throw an error if it cannot delete', (done: DoneFn) => {
      const spaceId = 'someSpaceId';
      const environmentId = 'someStage';
      const appId = 'someAppName';
      const expectedErrorMsg = `Failed to delete ${appId} in ${spaceId} (${environmentId})`;

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error('someError'));
      });

      svc.deleteDeployment(spaceId, environmentId, appId)
        .subscribe(
          (msg: string) => {
            done.fail();
          },
          (err: string) => {
            expect(err).toEqual(expectedErrorMsg);
            done();
          }
        );
    });
  });

  describe('#getPods', () => {
    it('should return pods array', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello',
                  deployments: [
                    {
                      attributes: {
                        name: 'stage',
                        pod_total: 15,
                        pods: [
                          ['Terminating', 5],
                          ['Stopping', '3'],
                          ['Running', '1'],
                          ['Not Running', 4],
                          ['Starting', '2']
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      const expectedResponse = {
        total: 15,
        pods: [
          ['Not Running', 4],
          ['Running', 1],
          ['Starting', 2],
          ['Stopping', 3],
          ['Terminating', 5]
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getPods('foo-spaceId', 'stage', 'vertx-hello'),
        done: done
      });
    });

    it('should encode url', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello',
                  deployments: [
                    {
                      attributes: {
                        name: 'stage',
                        pod_total: 15,
                        pods: [
                          ['Terminating', 5],
                          ['Stopping', '3'],
                          ['Running', '1'],
                          ['Not Running', 4],
                          ['Starting', '2']
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      const expectedResponse = {
        total: 15,
        pods: [
          ['Not Running', 4],
          ['Running', 1],
          ['Starting', 2],
          ['Stopping', 3],
          ['Terminating', 5]
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId%2B',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getPods('foo-spaceId+', 'stage', 'vertx-hello'),
        done: done
      });
    });
  });

  describe('application links', () => {
    it('should provide logs URL', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env'
                      },
                      links: {
                        logs: 'http://example.com/logs'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-space',
        response: httpResponse,
        expected: 'http://example.com/logs',
        observable: svc.getLogsUrl('foo-space', 'foo-env', 'foo-app'),
        done: done
      });
    });

    it('should provide console URL', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env'
                      },
                      links: {
                        console: 'http://example.com/console'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-space',
        response: httpResponse,
        expected: 'http://example.com/console',
        observable: svc.getConsoleUrl('foo-space', 'foo-env', 'foo-app'),
        done: done
      });
    });

    it('should provide application URL', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'foo-app',
                  deployments: [
                    {
                      attributes: {
                        name: 'foo-env'
                      },
                      links: {
                        application: 'http://example.com/application'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-space',
        response: httpResponse,
        expected: 'http://example.com/application',
        observable: svc.getAppUrl('foo-space', 'foo-env', 'foo-app'),
        done: done
      });
    });
  });

});

describe('DeploymentsService with mock DeploymentApiService', () => {

  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    mockNotificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeploymentApiService,
          useFactory: (): jasmine.SpyObj<DeploymentApiService> => createMock(DeploymentApiService)
        },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: TIMER_TOKEN, useValue: new Subject<void>() },
        { provide: TIMESERIES_SAMPLES_TOKEN, useValue: 3 },
        { provide: POLL_RATE_TOKEN, useValue: 1 },
        DeploymentsService
      ]
    });
  });

  describe('#getApplications', () => {
    it('should publish faked application names', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
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
      ]));
      TestBed.get(DeploymentsService).getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return empty array if no applications', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([]));
      TestBed.get(DeploymentsService).getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual([]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return singleton array result', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([{
        attributes: { name: 'vertx-hello' }
      }]));
      TestBed.get(DeploymentsService).getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual(['vertx-hello']);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return empty array for null applications response', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of(null));
      TestBed.get(DeploymentsService).getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual([]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked, filtered and sorted environments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getEnvironments.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'run'
          }
        }, {
          attributes: {
            name: 'test'
          }
        }, {
          attributes: {
            name: 'stage'
          }
        }
      ]));
      TestBed.get(DeploymentsService).getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual(['stage', 'run']);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return singleton array result', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getEnvironments.and.returnValue(Observable.of([
        { attributes: { name: 'stage' } }
      ]));
      TestBed.get(DeploymentsService).getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual(['stage']);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return empty array if no environments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getEnvironments.and.returnValue(Observable.of([]));
      TestBed.get(DeploymentsService).getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual([]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return empty array for null environments response', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getEnvironments.and.returnValue(Observable.of(null));
      TestBed.get(DeploymentsService).getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual([]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for included deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'run', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be true if included in multiple deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              },
              {
                attributes: {
                  name: 'stage'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'run', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false for excluded deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if excluded in multiple deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              },
              {
                attributes: {
                  name: 'test'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if no deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: []
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if deployments is null', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: null
          }
        }
      ]));
      TestBed.get(DeploymentsService).isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#isDeployedInEnvironment', () => {
    it('should be true for included environments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        }]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'run')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be true if included in multiple applications and environments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              },
              {
                attributes: {
                  name: 'test'
                }
              }
            ]
          }
        },
        {
          attributes: {
            name: 'vertx-wiki',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              },
              {
                attributes: {
                  name: 'stage'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'run')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false for excluded environments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        },
        {
          attributes: {
            name: 'vertx-wiki',
            deployments: [
              {
                attributes: {
                  name: 'test'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if no environments are deployed', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: []
          }
        },
        {
          attributes: {
            name: 'vertx-wiki',
            deployments: []
          }
        }
      ]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if no applications exist', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if applications are null', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of(null));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should be false if deployments is null', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: null
          }
        }
      ]));
      TestBed.get(DeploymentsService).isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'stage',
                  version: '1.0.2'
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getVersion('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((version: string): void => {
          expect(version).toEqual('1.0.2');
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#scalePods', () => {
    it('should return success message on success', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).scalePods.and.returnValue(Observable.of({}));
      TestBed.get(DeploymentsService).scalePods('foo-spaceId', 'stage', 'vertx-hello', 2)
        .subscribe(
          (msg: string) => {
            expect(msg).toEqual('Successfully scaled vertx-hello');
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    it('should return failure message on error', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).scalePods.and.returnValue(Observable.throw('fail'));
      TestBed.get(DeploymentsService).scalePods('foo-spaceId', 'stage', 'vertx-hello', 2)
        .subscribe(
          (msg: string) => {
            done.fail(msg);
          },
          (err: string) => {
            expect(err).toEqual('Failed to scale vertx-hello');
            done();
          }
        );
    });
  });

  describe('#getPods', () => {
    it('should return pods for an existing deployment', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'stage',
                  pod_total: 2,
                  pods: [
                    ['Running', '1'],
                    ['Starting', '0'],
                    ['Stopping', '1']
                  ]
                }
              }
            ]
          }
        },
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'run',
                  pod_total: 1,
                  pods: [
                    ['Running', '0'],
                    ['Starting', '0'],
                    ['Stopping', '1']
                  ]
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getPods('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((pods: Pods): void => {
          expect(pods).toEqual({
            total: 2,
            pods: [
              ['Running', 1],
              ['Starting', 0],
              ['Stopping', 1]
            ]
          } as Pods);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return pods when there are multiple deployments', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: [
              {
                attributes: {
                  name: 'stage',
                  pod_total: 2,
                  pods: [
                    ['Running', '1'],
                    ['Starting', '0'],
                    ['Stopping', '1']
                  ]
                }
              },
              {
                attributes: {
                  name: 'run',
                  pod_total: 6,
                  pods: [
                    ['Running', '3'],
                    ['Starting', '2'],
                    ['Stopping', '1']
                  ]
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getPods('foo-spaceId', 'run', 'vertx-hello')
        .subscribe((pods: Pods): void => {
          expect(pods).toEqual({
            total: 6,
            pods: [
              ['Running', 3],
              ['Starting', 2],
              ['Stopping', 1]
            ]
          } as Pods);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#getDeploymentCpuStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getTimeseriesData.and.returnValue(Observable.of({
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
        end: 8
      }));
      TestBed.get(DeploymentApiService).getLatestTimeseriesData.and.returnValue(Observable.of({
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
      }));
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: CpuStat[]) => {
          expect(stats).toEqual([
            { used: 1, quota: 3, timestamp: 1 },
            { used: 2, quota: 3, timestamp: 2 },
            { used: 9, quota: 3, timestamp: 9 }
          ]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should round usage data points', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getTimeseriesData.and.returnValue(Observable.of({
        cores: [
          { value: 0.0001, time: 1 },
          { value: 0.00001, time: 2 }
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
        end: 8
      }));
      TestBed.get(DeploymentApiService).getLatestTimeseriesData.and.returnValue(Observable.of({
        cores: {
          time: 9, value: 0.00015
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
      }));
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: CpuStat[]) => {
          expect(stats).toEqual([
            { used: 0.0001, quota: 3, timestamp: 1 },
            { used: 0, quota: 3, timestamp: 2 },
            { used: 0.0002, quota: 3, timestamp: 9 }
          ]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#getDeploymentMemoryStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getTimeseriesData.and.returnValue(Observable.of({
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
        end: 8
      }));
      TestBed.get(DeploymentApiService).getLatestTimeseriesData.and.returnValue(Observable.of({
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
      }));
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getDeploymentMemoryStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: MemoryStat[]) => {
          expect(stats).toEqual([
            new ScaledMemoryStat(3, 3, 3),
            new ScaledMemoryStat(4, 3, 4),
            new ScaledMemoryStat(10, 3, 10)
          ]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should scale results to the sample with greatest unit', (done: DoneFn) => {
      TestBed.get(DeploymentApiService).getTimeseriesData.and.returnValue(Observable.of({
        cores: [
          { value: 0, time: 0 },
          { value: 0, time: 1 }
        ],
        net_rx: [
          { value: 0, time: 0 },
          { value: 0, time: 1 }
        ],
        net_tx: [
          { value: 0, time: 0 },
          { value: 0, time: 1 }
        ],
        memory: [
          { time: 0, value: 800 * Math.pow(1024, 1) },
          { time: 1, value: 100 * Math.pow(1024, 2) }
        ],
        start: 0,
        end: 1
      }));
      TestBed.get(DeploymentApiService).getLatestTimeseriesData.and.returnValue(Observable.of({
        cores: {
          time: 0, value: 0
        },
        net_tx: {
          time: 0, value: 0
        },
        net_rx: {
          time: 0, value: 0
        },
        memory: {
          time: 2, value: 110 * Math.pow(1024, 2)
        }
      }));
      TestBed.get(DeploymentApiService).getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 0,
                    memory: 512 * Math.pow(1024, 2)
                  }
                }
              }
            ]
          }
        }
      ]));
      TestBed.get(DeploymentsService).getDeploymentMemoryStat('foo-space', 'foo-env', 'foo-app', 3)
        .first()
        .subscribe((stats: MemoryStat[]) => {
          expect(stats).toEqual([
            jasmine.objectContaining({
              used: 0.8,
              quota: 512,
              units: MemoryUnit.MB
            }),
            jasmine.objectContaining({
              used: 100,
              quota: 512,
              units: MemoryUnit.MB
            }),
            jasmine.objectContaining({
              used: 110,
              quota: 512,
              units: MemoryUnit.MB
            })
          ] as any[]);
          done();
        });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('#hasDeployments', () => {
    const environments: string[] = ['stage', 'run'];

    it('should return true if there are deployed applications', (done: DoneFn): void => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app-1',
            deployments: [
              {
                attributes: {
                  name: 'stage'
                }
              },
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        },
        {
          attributes: {
            name: 'foo-app-2',
            deployments: [
              {
                attributes: {
                  name: 'stage'
                }
              },
              {
                attributes: {
                  name: 'run'
                }
              }
            ]
          }
        }
      ]));
      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(true);
        done();
      });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return true if there are is at least one deployed application', (done: DoneFn) => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app-1',
            deployments: [
              {
                attributes: {
                  name: 'stage'
                }
              }
            ]
          }
        },
        {
          attributes: {
            name: 'foo-app-2',
            deployments: []
          }
        }
      ]));
      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(true);
        done();
      });
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return false if there are no deployed applications', (done: DoneFn) => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app-1',
            deployments: []
          }
        },
        {
          attributes: {
            name: 'foo-app-2',
            deployments: []
          }
        }
      ]));
      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(false);
        done();
      });
      TestBed.get(TIMER_TOKEN).next();
    });
  });

  describe('getApplications', () => {
    function testApplicationsError(status: number, expectedMessage: Notification) {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      const error: Response & Error = new Response(new ResponseOptions({
        type: ResponseType.Error,
        body: JSON.stringify('Mock HTTP Error'),
        status: status
      })) as Response & Error;

      const vs = new VirtualTimeScheduler(VirtualAction);

      apiSvc.getApplications.and.returnValue(
        Observable.throw(error, vs)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getApplications('spaceId').first().subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(mockNotificationsService.message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on 401', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get applications',
        message: 'Not authorized to access service'
      };
      testApplicationsError(401, expectedMessage);
    });

    it('should notify on 403', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get applications',
        message: 'Not authorized to access service'
      };
      testApplicationsError(403, expectedMessage);
    });

    it('should notify on 404', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service unavailable. Please try again later'
      };
      testApplicationsError(404, expectedMessage);
    });

    it('should notify on 500', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service error. Please try again later'
      };
      testApplicationsError(500, expectedMessage);
    });

    it('should notify on unknown', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get applications',
        message: 'Unknown error. Please try again later'
      };
      testApplicationsError(411, expectedMessage);
    });
  });

  describe('getEnvironments', () => {
    function testEnvironmentsError(status: number, expectedMessage: Notification) {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      const error: Response & Error = new Response(new ResponseOptions({
        type: ResponseType.Error,
        body: JSON.stringify('Mock HTTP Error'),
        status: status
      })) as Response & Error;

      const vs = new VirtualTimeScheduler(VirtualAction);

      apiSvc.getEnvironments.and.returnValue(
        Observable.throw(error, vs)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getEnvironments('spaceId').first().subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(mockNotificationsService.message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on 401', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get environments',
        message: 'Not authorized to access service'
      };
      testEnvironmentsError(401, expectedMessage);
    });

    it('should notify on 403', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get environments',
        message: 'Not authorized to access service'
      };
      testEnvironmentsError(403, expectedMessage);
    });

    it('should notify on 404', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get environments',
        message: 'Service unavailable. Please try again later'
      };
      testEnvironmentsError(404, expectedMessage);
    });

    it('should notify on 500', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get environments',
        message: 'Service error. Please try again later'
      };
      testEnvironmentsError(500, expectedMessage);
    });

    it('should notify on unknown', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get environments',
        message: 'Unknown error. Please try again later'
      };
      testEnvironmentsError(411, expectedMessage);
    });
  });

  describe('getDeploymentCpuStat', () => {
    function setupErrorTests() {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));

      apiSvc.getTimeseriesData.and.returnValue(Observable.of({
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
        end: 8
      }));

      apiSvc.getLatestTimeseriesData.and.returnValue(Observable.of({
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
      }));
    }

    function testGetTimeSeriesError(status: number, expectedMessage: Notification) {
      setupErrorTests();
      const error: Response & Error = new Response(new ResponseOptions({
        type: ResponseType.Error,
        body: JSON.stringify('Mock HTTP Error'),
        status: status
      })) as Response & Error;

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getTimeseriesData.and.returnValue(
        Observable.throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').first().subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(mockNotificationsService.message).toHaveBeenCalledWith(expectedMessage);
    }

    function testGetLatestTimeSeriesError(status: number, expectedMessage: Notification) {
      setupErrorTests();
      const error: Response & Error = new Response(new ResponseOptions({
        type: ResponseType.Error,
        body: JSON.stringify('Mock HTTP Error'),
        status: status
      })) as Response & Error;

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getLatestTimeseriesData.and.returnValue(
        Observable.throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').first().subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(mockNotificationsService.message).toHaveBeenCalledWith(expectedMessage);
    }

    function testGetApplicationsError(status: number, expectedMessage: Notification) {
      setupErrorTests();
      const error: Response & Error = new Response(new ResponseOptions({
        type: ResponseType.Error,
        body: JSON.stringify('Mock HTTP Error'),
        status: status
      })) as Response & Error;

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getApplications.and.returnValue(
        Observable.throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').first().subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(mockNotificationsService.message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on unknown', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get initial application statistics',
        message: 'Unknown error. Please try again later'
      };

      testGetTimeSeriesError(411, expectedMessage);
    });

    it('should notify on 404', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get latest application statistics',
        message: 'Service unavailable. Please try again later'
      };
      testGetLatestTimeSeriesError(404, expectedMessage);
    });

    it('should notify on 500', (): void => {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service error. Please try again later'
      };
      testGetApplicationsError(500, expectedMessage);
    });

    it('should return data', (done: DoneFn): void => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));
      apiSvc.getTimeseriesData.and.returnValue(Observable.of({
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
        end: 8
      }));
      apiSvc.getLatestTimeseriesData.and.returnValue(Observable.of({
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
      }));

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').first().subscribe((stats: CpuStat[]): void => {
        expect(stats).toEqual([
          { used: 1, quota: 3, timestamp: 1 },
          { used: 2, quota: 3, timestamp: 2 },
          { used: 9, quota: 3, timestamp: 9 }
        ]);
        done();
      });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();
    });

    it('should return nothing when application is not deployed in environment', (done: DoneFn): void => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'bar-env',
                  pods: [['Running', '1']],
                  pod_total: 1,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').subscribe((stats: CpuStat[]): void => {
        done.fail('should not have emitted');
      });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();

      Observable.timer(500).first().subscribe(() => done());
    });

    it('should return nothing when application has no pods', (done: DoneFn): void => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [],
                  pod_total: 0,
                  pods_quota: {
                    cpucores: 3,
                    memory: 3
                  }
                }
              }
            ]
          }
        }
      ]));

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').subscribe((stats: CpuStat[]): void => {
        done.fail('should not have emitted');
      });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();

      Observable.timer(500).first().subscribe(() => done());
    });

    it('should emit updates when deployment reappears', (done: DoneFn): void => {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      apiSvc.getApplications.and.returnValue(Observable.of([
        {
          attributes: {
            name: 'foo-app',
            deployments: [
              {
                attributes: {
                  name: 'foo-env',
                  pods: [],
                  pod_total: 0,
                  pods_quota: {
                    cpucores: 1,
                    memory: 1
                  }
                }
              }
            ]
          }
        }
      ]));
      apiSvc.getLatestTimeseriesData.and.returnValue(Observable.of({
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
      }));
      apiSvc.getTimeseriesData.and.returnValue(Observable.of({
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
        end: 8
      }));

      let delayPassed: boolean = false;

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').first().subscribe((stats: CpuStat[]): void => {
        if (!delayPassed) {
          done.fail('should not have emitted before delay passed');
        }
        expect(stats).toEqual([
          { used: 1, quota: 2, timestamp: 1 },
          { used: 2, quota: 2, timestamp: 2 },
          { used: 9, quota: 2, timestamp: 9 }
        ]);
        done();
      });
      TestBed.get(TIMER_TOKEN).next();
      TestBed.get(TIMER_TOKEN).next();

      Observable.timer(500).first().subscribe(() => {
        delayPassed = true;

        apiSvc.getApplications.and.returnValue(Observable.of([
          {
            attributes: {
              name: 'foo-app',
              deployments: [
                {
                  attributes: {
                    name: 'foo-env',
                    pods: [['Running', '1']],
                    pod_total: 1,
                    pods_quota: {
                      cpucores: 2,
                      memory: 2
                    }
                  }
                }
              ]
            }
          }
        ]));

        TestBed.get(TIMER_TOKEN).next();
        TestBed.get(TIMER_TOKEN).next();
      });
    });
  });

});
