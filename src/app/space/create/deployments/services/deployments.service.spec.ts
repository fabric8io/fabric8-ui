import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Logger,
  Notification,
  NotificationType
} from 'ngx-base';
import {
  empty as emptyObservable,
  of,
  Subject,
  throwError as _throw,
  timer,
  VirtualAction,
  VirtualTimeScheduler } from 'rxjs';
import {
  first,
  takeUntil
} from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetStat } from '../models/scaled-net-stat';
import { DeploymentApiService } from './deployment-api.service';
import {
  DeploymentsService,
  POLL_RATE_TOKEN,
  TIMER_TOKEN,
  TIMESERIES_SAMPLES_TOKEN
} from './deployments.service';

describe('DeploymentsService', () => {

  let service: DeploymentsService;
  let apiService: jasmine.SpyObj<DeploymentApiService>;
  let notifications: jasmine.SpyObj<NotificationsService>;
  let logger: jasmine.SpyObj<Logger>;
  let errorHandler: jasmine.SpyObj<ErrorHandler>;
  let timerToken: Subject<void>;

  beforeEach(function(): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DeploymentApiService, useFactory: (): jasmine.SpyObj<DeploymentApiService> => {
            const svc: jasmine.SpyObj<DeploymentApiService> = createMock(DeploymentApiService);
            return svc;
          }
        },
        {
          provide: NotificationsService, useFactory: (): jasmine.SpyObj<NotificationsService> => {
            const notifications: jasmine.SpyObj<NotificationsService> = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['message']);
            return notifications;
          }
        },
        {
          provide: Logger, useFactory: (): jasmine.SpyObj<Logger> => {
            const logger: jasmine.SpyObj<Logger> = createMock(Logger);
            return logger;
          }
        },
        {
          provide: ErrorHandler, useFactory: (): jasmine.SpyObj<ErrorHandler> => {
            const handler: jasmine.SpyObj<ErrorHandler> = createMock(ErrorHandler);
            return handler;
          }
        },
        { provide: TIMER_TOKEN, useValue: new Subject<void>() },
        { provide: TIMESERIES_SAMPLES_TOKEN, useValue: 3 },
        { provide: POLL_RATE_TOKEN, useValue: 1 },
        DeploymentsService
      ]
    });

    service = TestBed.get(DeploymentsService);
    apiService = TestBed.get(DeploymentApiService);
    notifications = TestBed.get(NotificationsService);
    logger = TestBed.get(Logger);
    errorHandler = TestBed.get(ErrorHandler);
    timerToken = TestBed.get(TIMER_TOKEN);
  });

  describe('#getApplications', () => {
    it('should publish faked application names', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
          done();
        });
      timerToken.next();
    });

    it('should return empty array if no applications', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([]));
      service.getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual([]);
          done();
        });
      timerToken.next();
    });

    it('should return singleton array result', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([{
        attributes: { name: 'vertx-hello' }
      }]));
      service.getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual(['vertx-hello']);
          done();
        });
      timerToken.next();
    });

    it('should return empty array for null applications response', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of(null));
      service.getApplications('foo-spaceId')
        .subscribe((applications: string[]): void => {
          expect(applications).toEqual([]);
          done();
        });
      timerToken.next();
    });
  });

  describe('#getEnvironments', () => {
    it('should sort environments', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'run'
          }
        }, {
          attributes: {
            name: 'stage'
          }
        }
      ]));
      service.getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual(['stage', 'run']);
          done();
        });
      timerToken.next();
    });

    it('should only emit on change', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'run'
          }
        }, {
          attributes: {
            name: 'stage'
          }
        }
      ]));
      let callCount: number = 0;
      service.getEnvironments('foo-spaceId').pipe(
        takeUntil(timer(1000))
      ).subscribe(
          (environments: string[]): void => {
            expect(environments).toEqual(['stage', 'run']);
            callCount++;
            if (callCount > 1) {
              return done.fail('should only have been called once');
            }
            timerToken.next();
          },
          err => done.fail(err),
          () => done()
        );
      timerToken.next();
    });

    it('should return singleton array result', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        { attributes: { name: 'stage' } }
      ]));
      service.getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual(['stage']);
          done();
        });
      timerToken.next();
    });

    it('should return empty array if no environments', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([]));
      service.getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual([]);
          done();
        });
      timerToken.next();
    });

    it('should return empty array for null environments response', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of(null));
      service.getEnvironments('foo-spaceId')
        .subscribe((environments: string[]): void => {
          expect(environments).toEqual([]);
          done();
        });
      timerToken.next();
    });
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for included deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'run', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      timerToken.next();
    });

    it('should be true if included in multiple deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'run', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      timerToken.next();
    });

    it('should be false for excluded deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if excluded in multiple deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if no deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: []
          }
        }
      ]));
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if deployments is null', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: null
          }
        }
      ]));
      service.isApplicationDeployedInEnvironment('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });
  });

  describe('#isDeployedInEnvironment', () => {
    it('should be true for included environments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isDeployedInEnvironment('foo-spaceId', 'run')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      timerToken.next();
    });

    it('should be true if included in multiple applications and environments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isDeployedInEnvironment('foo-spaceId', 'run')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(true);
          done();
        });
      timerToken.next();
    });

    it('should be false for excluded environments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if no environments are deployed', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if no applications exist', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([]));
      service.isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if applications are null', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of(null));
      service.isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });

    it('should be false if deployments is null', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
        {
          attributes: {
            name: 'vertx-hello',
            deployments: null
          }
        }
      ]));
      service.isDeployedInEnvironment('foo-spaceId', 'stage')
        .subscribe((deployed: boolean): void => {
          expect(deployed).toEqual(false);
          done();
        });
      timerToken.next();
    });
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.getVersion('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((version: string): void => {
          expect(version).toEqual('1.0.2');
          done();
        });
      timerToken.next();
    });
  });

  describe('#canScale', () => {
    const GB: number = Math.pow(1024, 3);
    it('should return true when remaining quota is sufficient', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                used: 1,
                quota: 2
              },
              memory: {
                used: 0.5 * GB,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }
      ]));
      apiService.getQuotaRequirementPerPod.and.returnValue(of({
        cpucores: 1,
        memory: 0.5 * GB
      }));

      service.canScale('foo-spaceId', 'stage', 'vertx-hello')
        .pipe(first())
        .subscribe((canScale: boolean): void => {
          expect(canScale).toBeTruthy();
          done();
        });
      timerToken.next();
    });

    it('should return false when remaining CPU quota is insufficient', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                used: 2,
                quota: 2
              },
              memory: {
                used: 0.5 * GB,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }
      ]));
      apiService.getQuotaRequirementPerPod.and.returnValue(of({
        cpucores: 1,
        memory: 0.5 * GB
      }));

      service.canScale('foo-spaceId', 'stage', 'vertx-hello')
        .pipe(first())
        .subscribe((canScale: boolean): void => {
          expect(canScale).toBeFalsy();
          done();
        });
      timerToken.next();
    });

    it('should return false when remaining Memory quota is insufficient', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                used: 1,
                quota: 2
              },
              memory: {
                used: 0.75 * GB,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }
      ]));
      apiService.getQuotaRequirementPerPod.and.returnValue(of({
        cpucores: 1,
        memory: 0.5 * GB
      }));

      service.canScale('foo-spaceId', 'stage', 'vertx-hello')
        .pipe(first())
        .subscribe((canScale: boolean): void => {
          expect(canScale).toBeFalsy();
          done();
        });
      timerToken.next();
    });
  });

  describe('#getMaximumPods', () => {
    const GB: number = Math.pow(1024, 3);
    it('should return appropriate number of maximum pods for typical scenario', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                used: 0,
                quota: 2
              },
              memory: {
                used: 0,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }
      ]));
      apiService.getQuotaRequirementPerPod.and.returnValue(of({
        cpucores: 1,
        memory: 0.5 * GB
      }));

      service.getMaximumPods('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((maxPods: number): void => {
          expect(maxPods).toEqual(2);
          done();
        });
      timerToken.next();
    });

    it('should return maximum based on resource with least available quota', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                used: 0,
                quota: 2
              },
              memory: {
                used: 0,
                quota: 1 * GB,
                units: 'bytes'
              }
            }
          }
        }
      ]));
      apiService.getQuotaRequirementPerPod.and.returnValue(of({
        cpucores: 2,
        memory: 0.5 * GB
      }));

      service.getMaximumPods('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((maxPods: number): void => {
          expect(maxPods).toEqual(1); // only one CPU allocation will fit
          done();
        });
      timerToken.next();
    });
  });

  describe('#scalePods', () => {
    it('should return success message on success', function(done: DoneFn): void {
      apiService.scalePods.and.returnValue(of({}));
      service.scalePods('foo-spaceId', 'stage', 'vertx-hello', 2)
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

    it('should return failure message on error', function(done: DoneFn): void {
      apiService.scalePods.and.returnValue(_throw('fail'));
      service.scalePods('foo-spaceId', 'stage', 'vertx-hello', 2)
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
    it('should return pods for an existing deployment', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.getPods('foo-spaceId', 'stage', 'vertx-hello')
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
      timerToken.next();
    });

    it('should return pods when there are multiple deployments', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      service.getPods('foo-spaceId', 'run', 'vertx-hello')
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
      timerToken.next();
    });

    it('should return pods array', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getPods('foo-spaceId', 'stage', 'vertx-hello')
        .subscribe((pods: Pods): void => {
          expect(pods).toEqual({
            total: 15,
            pods: [
              ['Not Running', 4],
              ['Running', 1],
              ['Starting', 2],
              ['Stopping', 3],
              ['Terminating', 5]
            ]
          } as Pods);
          done();
        });
      timerToken.next();
    });
  });

  describe('#getDeploymentCpuStat', () => {
    it('should combine timeseries and quota data', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
      service.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: CpuStat[]) => {
          expect(stats).toEqual([
            { used: 1, quota: 3, timestamp: 1 },
            { used: 2, quota: 3, timestamp: 2 },
            { used: 9, quota: 3, timestamp: 9 }
          ]);
          done();
        });
      timerToken.next();
      timerToken.next();
    });

    it('should round usage data points', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
      service.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: CpuStat[]) => {
          expect(stats).toEqual([
            { used: 0.0001, quota: 3, timestamp: 1 },
            { used: 0, quota: 3, timestamp: 2 },
            { used: 0.0002, quota: 3, timestamp: 9 }
          ]);
          done();
        });
      timerToken.next();
      timerToken.next();
    });
  });

  describe('#getDeploymentMemoryStat', () => {
    it('should combine timeseries and quota data', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
      service.getDeploymentMemoryStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: MemoryStat[]) => {
          expect(stats).toEqual([
            new ScaledMemoryStat(3, 3, 3),
            new ScaledMemoryStat(4, 3, 4),
            new ScaledMemoryStat(10, 3, 10)
          ]);
          done();
        });
      timerToken.next();
      timerToken.next();
    });

    it('should scale results to the sample with greatest unit', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
      service.getDeploymentMemoryStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: MemoryStat[]) => {
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
      timerToken.next();
      timerToken.next();
    });
  });

  describe('#getDeploymentNetworkStat', () => {
    it('should return scaled timeseries data', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: NetworkStat[]) => {
          expect(stats).toEqual([
            { sent: new ScaledNetStat(7, 7), received: new ScaledNetStat(5, 5) },
            { sent: new ScaledNetStat(8, 8), received: new ScaledNetStat(6, 6) },
            { sent: new ScaledNetStat(11, 11), received: new ScaledNetStat(12, 12) }
          ]);
          done();
        });
      timerToken.next();
      timerToken.next();
    });

    it('should scale results to the sample with greatest unit', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      }));
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      }));
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        first()
      ).subscribe((stats: NetworkStat[]) => {
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
          done();
        });
      timerToken.next();
      timerToken.next();
    });
  });

  describe('#getTimeseriesData', () => {
    it('should complete without errors if the deployment disappears', function(done: DoneFn): void {
      apiService.getTimeseriesData.and.returnValue(of({
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
      apiService.getLatestTimeseriesData.and.returnValue(of({
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
      apiService.getApplications.and.returnValue(of([
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
                  pod_total: 1,
                  pods: [['Running', '1']]
                }
              }
            ]
          }
        }
      ]));
      service.getDeploymentNetworkStat('foo-space', 'foo-env', 'foo-app', 3).pipe(
        takeUntil(timer(1000))
      ).subscribe(
          (stat: NetworkStat[]): void => {
            apiService.getApplications.and.returnValue(of([
              {
                attributes: {
                  name: 'foo-app',
                  deployments: []
                }
              }
            ]));
            apiService.getLatestTimeseriesData.and.returnValue(_throw('Generic error message'));
            timerToken.next();
          },
          err => {
            done.fail(err.message || err);
            return emptyObservable();
          },
          () => {
            expect(logger.error).not.toHaveBeenCalled();
            expect(notifications.message).not.toHaveBeenCalled();
            expect(errorHandler.handleError).not.toHaveBeenCalled();
            done();
          }
        );
      timerToken.next();
    });
  });

  describe('#getEnvironmentCpuStat', () => {
    it('should return a "used" value of 8 and a "quota" value of 10', function(done: DoneFn): void {
      apiService.getEnvironments.and.returnValue(of([
        {
          attributes: {
            name: 'stage',
            quota: {
              cpucores: {
                quota: 10,
                used: 8
              }
            }
          }
        }
      ]));
      service.getEnvironmentCpuStat('foo-spaceId', 'stage')
        .subscribe((cpuStat: CpuStat): void => {
          expect(cpuStat).toEqual({ quota: 10, used: 8 });
          done();
        });
      timerToken.next();
    });
  });

  describe('#getEnvironmentMemoryStat', () => {
    it('should return a "used" value of 512 and a "quota" value of 1024 with units in "MB"', function(done: DoneFn): void {
      const GB: number = Math.pow(1024, 3);
      apiService.getEnvironments.and.returnValue(of([
        {
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
        }
      ]));
      service.getEnvironmentMemoryStat('foo-spaceId', 'stage')
        .subscribe((memoryStat: MemoryStat): void => {
          expect(memoryStat).toEqual(new ScaledMemoryStat(0.5 * GB, 1 * GB));
          done();
        });
      timerToken.next();
    });
  });

  describe('#deleteDeployment', () => {
    it('should delete a deployment with the correct URL', function(done: DoneFn): void {
      apiService.deleteDeployment.and.returnValue(of('OK'));
      expect(apiService.deleteDeployment).not.toHaveBeenCalled();
      service.deleteDeployment('spaceId', 'envId', 'appId')
        .subscribe(
          (msg: string) => {
            expect(msg).toEqual('Deployment has successfully deleted');
            expect(apiService.deleteDeployment).toHaveBeenCalledWith(
              'spaceId', 'envId', 'appId'
            );
            done();
          },
          (err: string) => {
            done.fail(err);
          }
        );
    });

    it('should throw an error if it cannot delete', function(done: DoneFn): void {
      const spaceId: string = 'someSpaceId';
      const environmentId: string = 'someStage';
      const appId: string = 'someAppName';
      apiService.deleteDeployment.and.returnValue(_throw('FAIL'));
      expect(apiService.deleteDeployment).not.toHaveBeenCalled();
      service.deleteDeployment(spaceId, environmentId, appId)
        .subscribe(
          (msg: string) => {
            done.fail();
          },
          (err: string) => {
            expect(err).toEqual(`Failed to delete ${appId} in ${spaceId} (${environmentId})`);
            expect(apiService.deleteDeployment).toHaveBeenCalledWith(
              spaceId, environmentId, appId
            );
            done();
          }
        );
    });
  });

  describe('application links', () => {
    it('should provide logs URL', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getLogsUrl('foo-space', 'foo-env', 'foo-app')
        .subscribe((url: string): void => {
          expect(url).toEqual('http://example.com/logs');
          done();
        });
      timerToken.next();
    });

    it('should provide console URL', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getConsoleUrl('foo-space', 'foo-env', 'foo-app')
        .subscribe((url: string): void => {
          expect(url).toEqual('http://example.com/console');
          done();
        });
      timerToken.next();
    });

    it('should provide application URL', function(done: DoneFn): void {
      apiService.getApplications.and.returnValue(of([
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
      ]));
      service.getAppUrl('foo-space', 'foo-env', 'foo-app')
        .subscribe((url: string): void => {
          expect(url).toEqual('http://example.com/application');
          done();
        });
      timerToken.next();
    });
  });


  describe('#hasDeployments', () => {
    const environments: string[] = ['stage', 'run'];

    it('should return true if there are deployed applications', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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
      const svc: DeploymentsService = service;
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(true);
        done();
      });
      timerToken.next();
    });

    it('should return true if there are is at least one deployed application', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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
      const svc: DeploymentsService = service;
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(true);
        done();
      });
      timerToken.next();
    });

    it('should return false if there are no deployed applications', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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
      const svc: DeploymentsService = service;
      svc.hasDeployments('foo-spaceId', environments).subscribe(bool => {
        expect(bool).toEqual(false);
        done();
      });
      timerToken.next();
    });
  });

  describe('getApplications', () => {
    function testApplicationsError(status: number, expectedMessage: Notification) {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
      const error: HttpErrorResponse = new HttpErrorResponse({
        statusText: 'Mock HTTP Error',
        status: status
      });

      const vs = new VirtualTimeScheduler(VirtualAction);

      apiSvc.getApplications.and.returnValue(
        _throw(error, vs)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getApplications('spaceId').pipe(first()).subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(TestBed.get(NotificationsService).message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on 401', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get applications',
        message: 'Not authorized to access service'
      };
      testApplicationsError(401, expectedMessage);
    });

    it('should notify on 403', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get applications',
        message: 'Not authorized to access service'
      };
      testApplicationsError(403, expectedMessage);
    });

    it('should notify on 404', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service unavailable. Please try again later'
      };
      testApplicationsError(404, expectedMessage);
    });

    it('should notify on 500', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service error. Please try again later'
      };
      testApplicationsError(500, expectedMessage);
    });

    it('should notify on unknown', function(): void {
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
      const error: HttpErrorResponse = new HttpErrorResponse({
        statusText: JSON.stringify('Mock HTTP Error'),
        status: status
      });

      const vs = new VirtualTimeScheduler(VirtualAction);

      apiSvc.getEnvironments.and.returnValue(
        _throw(error, vs)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);
      svc.getEnvironments('spaceId').pipe(first()).subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(TestBed.get(NotificationsService).message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on 401', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get environments',
        message: 'Not authorized to access service'
      };
      testEnvironmentsError(401, expectedMessage);
    });

    it('should notify on 403', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get environments',
        message: 'Not authorized to access service'
      };
      testEnvironmentsError(403, expectedMessage);
    });

    it('should notify on 404', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get environments',
        message: 'Service unavailable. Please try again later'
      };
      testEnvironmentsError(404, expectedMessage);
    });

    it('should notify on 500', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get environments',
        message: 'Service error. Please try again later'
      };
      testEnvironmentsError(500, expectedMessage);
    });

    it('should notify on unknown', function(): void {
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
      apiSvc.getApplications.and.returnValue(of([
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

      apiSvc.getTimeseriesData.and.returnValue(of({
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

      apiSvc.getLatestTimeseriesData.and.returnValue(of({
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
      const error: HttpErrorResponse = new HttpErrorResponse({
        statusText: JSON.stringify('Mock HTTP Error'),
        status: status
      });

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getTimeseriesData.and.returnValue(
        _throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').pipe(first()).subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(TestBed.get(NotificationsService).message).toHaveBeenCalledWith(expectedMessage);
    }

    function testGetLatestTimeSeriesError(status: number, expectedMessage: Notification) {
      setupErrorTests();
      const error: HttpErrorResponse = new HttpErrorResponse({
        statusText: JSON.stringify('Mock HTTP Error'),
        status: status
      });

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getLatestTimeseriesData.and.returnValue(
        _throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').pipe(first()).subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(TestBed.get(NotificationsService).message).toHaveBeenCalledWith(expectedMessage);
    }

    function testGetApplicationsError(status: number, expectedMessage: Notification) {
      setupErrorTests();
      const error: HttpErrorResponse = new HttpErrorResponse({
        statusText: JSON.stringify('Mock HTTP Error'),
        status: status
      });

      const vs = new VirtualTimeScheduler(VirtualAction);
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);

      apiSvc.getApplications.and.returnValue(
        _throw(error)
      );

      const svc: DeploymentsService = TestBed.get(DeploymentsService);

      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').pipe(first()).subscribe(
        () => fail('should not emit'),
        () => fail('should not emit'),
        () => fail('should not emit')
      );

      TestBed.get(TIMER_TOKEN).next();
      vs.flush();

      expect(TestBed.get(NotificationsService).message).toHaveBeenCalledWith(expectedMessage);
    }

    it('should notify on unknown', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.DANGER,
        header: 'Cannot get initial application statistics',
        message: 'Unknown error. Please try again later'
      };

      testGetTimeSeriesError(411, expectedMessage);
    });

    it('should notify on 404', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get latest application statistics',
        message: 'Service unavailable. Please try again later'
      };
      testGetLatestTimeSeriesError(404, expectedMessage);
    });

    it('should notify on 500', function(): void {
      const expectedMessage: Notification = {
        type: NotificationType.WARNING,
        header: 'Cannot get applications',
        message: 'Service error. Please try again later'
      };
      testGetApplicationsError(500, expectedMessage);
    });

    it('should return data', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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
      apiSvc.getTimeseriesData.and.returnValue(of({
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
      apiSvc.getLatestTimeseriesData.and.returnValue(of({
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

      const svc: DeploymentsService = service;
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').pipe(first()).subscribe((stats: CpuStat[]): void => {
        expect(stats).toEqual([
          { used: 1, quota: 3, timestamp: 1 },
          { used: 2, quota: 3, timestamp: 2 },
          { used: 9, quota: 3, timestamp: 9 }
        ]);
        done();
      });
      timerToken.next();
      timerToken.next();
    });

    it('should return nothing when application is not deployed in environment', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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

      const svc: DeploymentsService = service;
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').subscribe((stats: CpuStat[]): void => {
        done.fail('should not have emitted');
      });
      timerToken.next();
      timerToken.next();

      timer(500).pipe(first()).subscribe(() => done());
    });

    it('should return nothing when application has no pods', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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

      const svc: DeploymentsService = service;
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').subscribe((stats: CpuStat[]): void => {
        done.fail('should not have emitted');
      });
      timerToken.next();
      timerToken.next();

      timer(500).pipe(first()).subscribe(() => done());
    });

    it('should emit updates when deployment reappears', function(done: DoneFn): void {
      const apiSvc: jasmine.SpyObj<DeploymentApiService> = apiService;
      apiSvc.getApplications.and.returnValue(of([
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
      apiSvc.getLatestTimeseriesData.and.returnValue(of({
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
      apiSvc.getTimeseriesData.and.returnValue(of({
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

      const svc: DeploymentsService = service;
      svc.getDeploymentCpuStat('foo-space', 'foo-env', 'foo-app').pipe(first()).subscribe((stats: CpuStat[]): void => {
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
      timerToken.next();
      timerToken.next();

      timer(500).pipe(first()).subscribe(() => {
        delayPassed = true;

        apiSvc.getApplications.and.returnValue(of([
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
        timerToken.next();
        timerToken.next();
      });
    });
  });

});
