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
  Subscription
} from 'rxjs';

import { Logger } from 'ngx-base';

import { NotificationsService } from 'app/shared/notifications.service';

import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetworkStat } from '../models/scaled-network-stat';
import {
  Application,
  DeploymentsService,
  MultiTimeseriesData,
  NetworkStat,
  TimeConstrainedStats
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

  let mockBackend: MockBackend;
  let mockLogger: jasmine.SpyObj<Logger>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let svc: DeploymentsService;

  beforeEach(() => {
    const mockAuthService: jasmine.SpyObj<AuthenticationService> = createMock(AuthenticationService);
    mockAuthService.getToken.and.returnValue('mock-auth-token');

    mockLogger = jasmine.createSpyObj<Logger>('Logger', ['error']);
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
          provide: NotificationsService, useValue: mockNotificationsService
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
      const timeseriesResponse = {
        data: {
          attributes: {
            cores: {
              time: 1,
              value: 2
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
      const quotaResponse = {
        data: [{
          attributes: {
            name: 'foo-env',
            quota: {
              cpucores: {
                quota: 3,
                used: 4
              }
            }
          }
        }]
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
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
          attributes: {
            memory: {
              time: 1,
              value: 2
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
      const quotaResponse = {
        data: [{
          attributes: {
            name: 'foo-env',
            quota: {
              memory: {
                quota: 3,
                used: 4
              }
            }
          }
        }]
      };

      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
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

  describe('#getDeploymentNetworkStat', () => {
    it('should return scaled timeseries data', (done: DoneFn) => {
      const timeseriesResponse = {
        data: {
          attributes: {
            net_tx: {
              time: 0,
              value: 1.7
            },
            net_rx: {
              time: 2,
              value: 3.1
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
        const timeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/stats$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
        const requestUrl: string = connection.request.url;
        let responseBody: any;
        if (timeseriesRegex.test(requestUrl)) {
          responseBody = timeseriesResponse;
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
        .subscribe((stat: NetworkStat) => {
          expect(stat).toEqual({ sent: new ScaledNetworkStat(1.7), received: new ScaledNetworkStat(3.1) });
          subscription.unsubscribe();
          done();
        });
    });
  });

  describe('#getDeploymentTimeConstrainedStats', () => {
    it('should combine MultiTimeseries and quota data', (done: DoneFn) => {
      const timeseriesResponse = {
        data: {
          cores: [{ time: 1, value: 1 }, { time: 2, value: 2 }],
          memory: [{ time: 1, value: 2 }, { time: 2, value: 3 }],
          net_tx: [{ time: 1, value: 3 }, { time: 2, value: 4 }],
          net_rx: [{ time: 1, value: 4 }, { time: 2, value: 5 }],
          start: 0,
          end: 0
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
      const quotaResponse = {
        data: [{
          attributes: {
            name: 'foo-env',
            quota: {
              cpucores: {
                quota: 2,
                used: 1
              },
              memory: {
                quota: 4,
                used: 2,
                units: 'MB'
              }
            }
          }
        }]
      };
      const expectedResponse: TimeConstrainedStats = {
        cpu: [
          { data: { used: 1, quota: 2 }, timestamp: 1 },
          { data: { used: 2, quota: 2 }, timestamp: 2 }
        ],
        memory: [
          { data: new ScaledMemoryStat(2, 4), timestamp: 1 },
          { data: new ScaledMemoryStat(3, 4), timestamp: 2 }
        ],
        network: [
          { data: { sent: new ScaledNetworkStat(3), received: new ScaledNetworkStat(4) }, timestamp: 1 },
          { data: { sent: new ScaledNetworkStat(4), received: new ScaledNetworkStat(5) }, timestamp: 2 }
        ]
      };
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/statseries\?start=\d+&end=\d+$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
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

      svc.getDeploymentTimeConstrainedStats('foo-space', 'foo-app', 'foo-env', (2 * 60 * 1000))
        .subscribe((stats: TimeConstrainedStats) => {
          expect(stats).toEqual(expectedResponse);
          subscription.unsubscribe();
          done();
        });
    });

    it('should return an empty TimeConstrainedStats object if there is no data', (done: DoneFn) => {
      const timeseriesResponse = {
        data: {
          cores: [],
          memory: [],
          net_tx: [],
          net_rx: []
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
      const quotaResponse = {
        data: [{
          attributes: {
            name: 'foo-env',
            quota: {
              cpucores: {
                quota: 2,
                used: 0
              },
              memory: {
                quota: 4,
                used: 0
              }
            }
          }
        }]
      };
      const expectedResponse: TimeConstrainedStats = {
        cpu: [],
        memory: [],
        network: []
      };
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        const timeseriesRegex: RegExp = /\/deployments\/spaces\/foo-space\/applications\/foo-app\/deployments\/foo-env\/statseries\?start=\d+&end=\d+$/;
        const deploymentRegex: RegExp = /\/deployments\/spaces\/foo-space$/;
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

      svc.getDeploymentTimeConstrainedStats('foo-space', 'foo-app', 'foo-env', (2 * 60 * 1000))
      .subscribe((stats: TimeConstrainedStats) => {
        expect(stats).toEqual(expectedResponse);
        subscription.unsubscribe();
        done();
      });
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

  describe('HTTP error handling', () => {
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
