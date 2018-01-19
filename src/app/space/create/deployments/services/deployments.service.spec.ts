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
  NetworkStat
} from './deployments.service';

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

  function doMockHttpTest<U>(response: any, expected: U, obs: Observable<U>, done?: DoneFn): void {
    const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    obs.subscribe(
      (data: U) => {
        expect(data).toEqual(expected);
        subscription.unsubscribe();
        if (done) {
          done();
        }
      },
      (err: any) => {
        if (done) {
          done.fail(err);
        }
      }
    );
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
      doMockHttpTest(httpResponse, ['vertx-hello', 'vertx-paint', 'vertx-wiki'],
        svc.getApplications('foo-spaceId'), done);
    });

    it('should return empty array if no applications', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: []
          }
        }
      };
      doMockHttpTest(httpResponse, [],
        svc.getApplications('foo-spaceId'), done);
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
      doMockHttpTest(httpResponse, ['vertx-hello'],
        svc.getApplications('foo-spaceId'), done);
    });

    it('should return empty array for null applications response', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: null
          }
        }
      };
      doMockHttpTest(httpResponse, [], svc.getApplications('foo-spaceId'), done);
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
      doMockHttpTest(httpResponse, expectedResponse, svc.getEnvironments('foo-spaceId'), done);
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
      doMockHttpTest(httpResponse, [{ name: 'stage' }], svc.getEnvironments('foo-spaceId'), done);
    });

    it('should return empty array if no environments', (done: DoneFn) => {
      const httpResponse = {
        data: []
      };
      doMockHttpTest(httpResponse, [], svc.getEnvironments('foo-spaceId'), done);
    });

    it('should return empty array for null environments response', (done: DoneFn) => {
      const httpResponse = {
        data: null
      };
      doMockHttpTest(httpResponse, [], svc.getEnvironments('foo-spaceId'), done);
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
      doMockHttpTest(httpResponse, true,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'run'), done);
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
      doMockHttpTest(httpResponse, true,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'run'), done);
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
      doMockHttpTest(httpResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
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
      doMockHttpTest(httpResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
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
      doMockHttpTest(httpResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
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
      doMockHttpTest(httpResponse, false,
        svc.isApplicationDeployedInEnvironment('foo-spaceId', 'vertx-hello', 'stage'), done);
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
      doMockHttpTest(httpResponse, true, svc.isDeployedInEnvironment('foo-spaceId', 'run'), done);
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
      doMockHttpTest(httpResponse, true, svc.isDeployedInEnvironment('foo-spaceId', 'run'), done);
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
      doMockHttpTest(httpResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
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
      doMockHttpTest(httpResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if no applications exist', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: []
          }
        }
      };
      doMockHttpTest(httpResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
    });

    it('should be false if applications are null', (done: DoneFn) => {
      const httpResponse = {
        data: {
          attributes: {
            applications: null
          }
        }
      };
      doMockHttpTest(httpResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
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
      doMockHttpTest(httpResponse, false, svc.isDeployedInEnvironment('foo-spaceId', 'stage'), done);
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
      doMockHttpTest(httpResponse, '1.0.2',
        svc.getVersion('foo-spaceId', 'vertx-hello', 'stage'), done);
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

      doMockHttpTest(httpResponse, expectedResponse,
        svc.getPods('foo-spaceId', 'vertx-hello', 'stage'), done);
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

      doMockHttpTest(httpResponse, expectedResponse,
        svc.getPods('foo-spaceId', 'vertx-hello', 'run'), done);
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
          net_tx: {
            time: 0,
            value: 1.7
          },
          net_rx: {
            time: 2,
            value: 3.1
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

  describe('#getEnvironmentCpuStat', () => {
    it('should return a "used" value of 8 and a "quota" value of 10', (done: DoneFn) => {
      const expectedResponse = {
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
      doMockHttpTest(expectedResponse, expectedResponse.data[0].attributes.quota.cpucores,
        svc.getEnvironmentCpuStat('foo-spaceId', 'stage'), done);
    });
  });

  describe('#getEnvironmentMemoryStat', () => {
    it('should return a "used" value of 512 and a "quota" value of 1024 with units in "MB"', (done: DoneFn) => {
      const GB = Math.pow(1024, 3);
      const expectedResponse = {
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
      doMockHttpTest(expectedResponse, new ScaledMemoryStat(0.5 * GB, 1 * GB),
        svc.getEnvironmentMemoryStat('foo-spaceId', 'stage'), done);
    });
  });

  describe('#getPods', () => {
    it('should return pods array', (done: DoneFn) => {
      const expectedResponse = {
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

  describe('HTTP error handling', () => {
    it('should log errors', (done: DoneFn) => {
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Response(
          new ResponseOptions({
            type: ResponseType.Error,
            body: JSON.stringify('Mock HTTP Error'),
            status: 404
          })
        ) as Response & Error);
      });
      expect(mockLogger.error).not.toHaveBeenCalled();
      svc.getApplications('foo-spaceId').subscribe(
        success => {
          subscription.unsubscribe();
          done.fail('Should have hit error handler');
        },
        error => {
          expect(error).toBe(404);
          expect(mockLogger.error).toHaveBeenCalled();
          subscription.unsubscribe();
          done();
        }
      );
    });

    it('should notify on errors', (done: DoneFn) => {
      const subscription: Subscription = mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Response(
          new ResponseOptions({
            type: ResponseType.Error,
            body: JSON.stringify('Mock HTTP Error'),
            status: 404
          })
        ) as Response & Error);
      });
      expect(mockNotificationsService.message).not.toHaveBeenCalled();
      svc.getApplications('foo-spaceId').subscribe(
        success => {
          subscription.unsubscribe();
          done.fail('Should have hit error handler');
        },
        error => {
          expect(error).toBe(404);
          expect(mockNotificationsService.message).toHaveBeenCalled();
          subscription.unsubscribe();
          done();
        }
      );
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
      doMockHttpTest(httpResponse, 'http://example.com/logs',
        svc.getLogsUrl('foo-space', 'foo-app', 'foo-env'), done);
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
      doMockHttpTest(httpResponse, 'http://example.com/console',
        svc.getConsoleUrl('foo-space', 'foo-app', 'foo-env'), done);
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
      doMockHttpTest(httpResponse, 'http://example.com/application',
        svc.getAppUrl('foo-space', 'foo-app', 'foo-env'), done);
    });
  });

});
