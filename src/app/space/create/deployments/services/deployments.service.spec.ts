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
  Subscription
} from 'rxjs';

import { Logger } from 'ngx-base';

import { NotificationsService } from 'app/shared/notifications.service';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetworkStat } from '../models/scaled-network-stat';
import {
  DeploymentsService,
  NetworkStat,
  TIMER_TOKEN
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
          provide: TIMER_TOKEN,
          useValue: serviceUpdater
        },
        DeploymentsService
      ]
    });
    svc = TestBed.get(DeploymentsService);
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

  describe('#getApplications', () => {
    it('should publish faked application names', (done: DoneFn) => {
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
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: ['vertx-hello', 'vertx-paint', 'vertx-wiki'],
        observable: svc.getApplications('foo-spaceId'),
        done: done
      });
    });

    it('should return empty array if no applications', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: []
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: [],
        observable: svc.getApplications('foo-spaceId'),
        done: done
      });
    });

    it('should return singleton array result', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [{
              attributes: { name: 'vertx-hello' }
            }]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: ['vertx-hello'],
        observable: svc.getApplications('foo-spaceId'),
        done: done
      });
    });

    it('should return empty array for null applications response', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: null
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: [],
        observable: svc.getApplications('foo-spaceId'),
        done: done
      });
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked, filtered and sorted environments', (done: DoneFn) => {
      const httpResponse = {
        data: [
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
        ]
      };
      const expectedResponse = [{ name: 'stage' }, { name: 'run' }];
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getEnvironments('foo-spaceId'),
        done: done
      });
    });

    it('should return singleton array result', (done: DoneFn) => {
      const httpResponse = {
        data: [
          {
            attributes: {
              name: 'stage'
            }
          }
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: [{ name: 'stage' }],
        observable: svc.getEnvironments('foo-spaceId'),
        done: done
      });
    });

    it('should return empty array if no environments', (done: DoneFn) => {
      const httpResponse = {
        data: []
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: [],
        observable: svc.getEnvironments('foo-spaceId'),
        done: done
      });
    });

    it('should return empty array for null environments response', (done: DoneFn) => {
      const httpResponse = {
        data: null
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId/environments',
        response: httpResponse,
        expected: [],
        observable: svc.getEnvironments('foo-spaceId'),
        done: done
      });
    });
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for included deployments', (done: DoneFn) => {
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
                        name: 'run'
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
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: true,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'run'),
        done: done
      });
    });

    it('should be true if included in multiple deployments', (done: DoneFn) => {
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
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: true,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'run'),
        done: done
      });
    });

    it('should be false for excluded deployments', (done: DoneFn) => {
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
                        name: 'run'
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
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });

    it('should be false if excluded in multiple deployments', (done: DoneFn) => {
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
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });

    it('should be false if no deployments', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello',
                  deployments: []
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });

    it('should be false if deployments is null', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello',
                  deployments: null
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });
  });

  describe('#isDeployedInEnvironment', () => {
    it('should be true for included environments', (done: DoneFn) => {
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
                        name: 'run'
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
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: true,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'run'),
        done: done
      });
    });

    it('should be true if included in multiple applications and environments', (done: DoneFn) => {
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
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: true,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'run'),
        done: done
      });
    });

    it('should be false for excluded environments', (done: DoneFn) => {
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
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should be false if no environments are deployed', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
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
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should be false if no applications exist', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: []
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should be false if applications are null', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: null
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'stage'),
        done: done
      });
    });

    it('should be false if deployments is null', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: [
              {
                attributes: {
                  name: 'vertx-hello',
                  deployments: null
                }
              }
            ]
          }
        }
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: false,
        observable: svc.isDeployedInEnvironment('foo-spaceId', 'stage'),
        done: done
      });
    });
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', (done: DoneFn) => {
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
                        version: '1.0.2'
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
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: '1.0.2',
        observable: svc.getVersion('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });
  });

  describe('#scalePods', () => {
    it('should return success message on success', (done: DoneFn) => {
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({ status: 200 })
        ));
      });

      svc.scalePods('foo-spaceId', 'vertx-hello', 'stage', 2)
        .subscribe(
          (msg: string) => {
            expect(msg).toEqual('Successfully scaled stage');
            subscription.unsubscribe();
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    it('should return failure message on error', (done: DoneFn) => {
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Response(
          new ResponseOptions({
            type: ResponseType.Error,
            status: 400
          })
        ) as Response & Error);
      });

      svc.scalePods('foo-spaceId', 'vertx-hello', 'stage', 2)
        .subscribe(
          (msg: string) => {
            done.fail(msg);
          },
          (err: string) => {
            expect(err).toEqual('Failed to scale stage');
            subscription.unsubscribe();
            done();
          }
        );
    });
  });

  describe('#getPods', () => {
    it('should return pods for an existing deployment', (done: DoneFn) => {
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
            ]
          }
        }
      };
      const expectedResponse = {
        total: 2,
        pods: [
          ['Running', 1],
          ['Starting', 0],
          ['Stopping', 1]
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getPods('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });

    it('should return pods when there are multiple deployments', (done: DoneFn) => {
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
            ]
          }
        }
      };
      const expectedResponse = {
        total: 6,
        pods: [
          ['Running', 3],
          ['Starting', 2],
          ['Stopping', 1]
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getPods('foo-spaceId', 'vertx-hello', 'run'),
        done: done
      });
    });
  });

  describe('#getDeploymentCpuStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
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
                        pods_quota: {
                          cpucores: 3,
                          memory: 3
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

      // FIXME: for some reason in the test environment, the first front loaded stat is dropped by Observable.combineLatest
      svc.getDeploymentCpuStat('foo-space', 'foo-app', 'foo-env')
        .bufferCount(2)
        .subscribe((stats: CpuStat[]) => {
          expect(stats).toEqual([
            { used: 2, quota: 3, timestamp: 2 },
            { used: 9, quota: 3, timestamp: 9 }
          ]);
          done();
        });
      serviceUpdater.next();
      serviceUpdater.next();
    });
  });

  describe('#getDeploymentMemoryStat', () => {
    it('should combine timeseries and quota data', (done: DoneFn) => {
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
                        pods_quota: {
                          cpucores: 3,
                          memory: 3
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

      // FIXME: for some reason in the test environment, the first front loaded stat is dropped by Observable.combineLatest
      svc.getDeploymentMemoryStat('foo-space', 'foo-app', 'foo-env')
        .bufferCount(2)
        .subscribe((stats: MemoryStat[]) => {
          expect(stats).toEqual([
            new ScaledMemoryStat(4, 3, 4),
            new ScaledMemoryStat(10, 3, 10)
          ]);
          subscription.unsubscribe();
          done();
        });
      serviceUpdater.next();
      serviceUpdater.next();
    });
  });

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
                        name: 'foo-env'
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

      svc.getDeploymentNetworkStat('foo-space', 'foo-app', 'foo-env')
        .bufferCount(3)
        .subscribe((stats: NetworkStat[]) => {
          expect(stats).toEqual([
            { sent: new ScaledNetworkStat(7, 7), received: new ScaledNetworkStat(5, 5) },
            { sent: new ScaledNetworkStat(8, 8), received: new ScaledNetworkStat(6, 6) },
            { sent: new ScaledNetworkStat(11, 11), received: new ScaledNetworkStat(12, 12) }
          ]);
          subscription.unsubscribe();
          done();
        });
      serviceUpdater.next();
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
        expected: new ScaledMemoryStat(0.5 * GB, 1 * GB),
        observable: svc.getEnvironmentMemoryStat('foo-spaceId', 'stage'),
        done: done
      });
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
                        pod_total: 6,
                        pods: [
                          ['Running', '1'],
                          ['Starting', '2'],
                          ['Stopping', '3']
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
        total: 6,
        pods: [
          [ 'Running', 1 ],
          [ 'Starting', 2 ],
          [ 'Stopping', 3 ]
        ]
      };
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: httpResponse,
        expected: expectedResponse,
        observable: svc.getPods('foo-spaceId', 'vertx-hello', 'stage'),
        done: done
      });
    });
  });

  // TODO: re-enable error propagation.
  // See https://github.com/openshiftio/openshift.io/issues/2360#issuecomment-368915994
  xdescribe('HTTP error handling', () => {
    it('should report errors to global ErrorHandler', (done: DoneFn) => {
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })),
        expectedError: 404,
        observable: svc.getApplications('foo-spaceId')
          .do(() => done.fail('should hit error handler'),
            () => expect(mockErrorHandler.handleError).toHaveBeenCalled()),
        done: done
      });
    });

    it('should log errors', (done: DoneFn) => {
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })),
        expectedError: 404,
        observable: svc.getApplications('foo-spaceId')
          .do(() => done.fail('should hit error handler'),
            () => expect(mockLogger.error).toHaveBeenCalled()),
        done: done
      });
    });

    it('should notify on errors', (done: DoneFn) => {
      doMockHttpTest({
        url: 'http://example.com/deployments/spaces/foo-spaceId',
        response: new Response(new ResponseOptions({
          type: ResponseType.Error,
          body: JSON.stringify('Mock HTTP Error'),
          status: 404
        })),
        expectedError: 404,
        observable: svc.getApplications('foo-spaceId')
          .do(() => done.fail('should hit error handler'),
            () => expect(mockNotificationsService.message).toHaveBeenCalled()),
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
        observable: svc.getLogsUrl('foo-space', 'foo-app', 'foo-env'),
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
        observable: svc.getConsoleUrl('foo-space', 'foo-app', 'foo-env'),
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
        observable: svc.getAppUrl('foo-space', 'foo-app', 'foo-env'),
        done: done
      });
    });
  });

});
