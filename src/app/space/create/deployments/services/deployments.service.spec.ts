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

import { Observable } from 'rxjs';

import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { Environment } from '../models/environment';
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
          provide: WIT_API_URL, useValue: 'http://example.com'
        },
        DeploymentsService
      ]
    });
    svc = TestBed.get(DeploymentsService);
    mockBackend = TestBed.get(XHRBackend);
  });

  function doMockHttpTest<U>(response: any, expected: U, obs: Observable<U>, done: DoneFn): void {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: JSON.stringify(response),
          status: 200
        })
      ));
    });

    obs.subscribe((data: U) => {
      expect(data).toEqual(expected);
      done();
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
      // skip the first result since it will be a BehaviorSubject default value
      doMockHttpTest(expectedResponse, expectedResponse.data.applications.map(app => app.name),
        svc.getApplications('foo-spaceId').skip(1), done);
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', (done: DoneFn) => {
      const expectedResponse = {
        data: [
          { name: 'stage' }, { name: 'run' }, { name: 'test' }
        ]
      };
      // skip the first result since it will be a BehaviorSubject default value
      doMockHttpTest(expectedResponse, expectedResponse.data, svc.getEnvironments('foo-spaceId').skip(1), done);
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
  });

  describe('#isDeployedInEnvironment', () => {
    it('should be true', fakeAsync(() => {
      svc.isDeployedInEnvironment('foo', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', fakeAsync(() => {
      svc.getVersion('foo', 'bar').subscribe(val => {
        expect(val).toEqual('1.0.2');
      });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getDeploymentCpuStat', () => {
    it('should return a "quota" value of 10', fakeAsync(() => {
      svc.getDeploymentCpuStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.quota).toBe(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 1 and 10', fakeAsync(() => {
      svc.getDeploymentCpuStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(1);
          expect(val.used).toBeLessThanOrEqual(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getDeploymentMemoryStat', () => {
    it('should return a "quota" value of 256', fakeAsync(() => {
      svc.getDeploymentMemoryStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.quota).toBe(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 100 and 256', fakeAsync(() => {
      svc.getDeploymentMemoryStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(100);
          expect(val.used).toBeLessThanOrEqual(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a value in bytes', fakeAsync(() => {
      svc.getDeploymentMemoryStat('foo', 'bar', 'baz')
        .subscribe(val => {
          expect(val.units).toEqual('bytes');
        });
        tick(DeploymentsService.POLL_RATE_MS + 10);
        discardPeriodicTasks();
    }));
  });

  describe('#getEnvironmentCpuStat', () => {
    it('should return a "quota" value of 10', fakeAsync(() => {
      svc.getEnvironmentCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.quota).toBe(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 1 and 10', fakeAsync(() => {
      svc.getEnvironmentCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(1);
          expect(val.used).toBeLessThanOrEqual(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getEnvironmentMemoryStat', () => {
    it('should return a "quota" value of 256', fakeAsync(() => {
      svc.getEnvironmentMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.quota).toBe(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 100 and 256', fakeAsync(() => {
      svc.getEnvironmentMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(100);
          expect(val.used).toBeLessThanOrEqual(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a value in bytes', fakeAsync(() => {
      svc.getEnvironmentMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.units).toEqual('bytes');
        });
        tick(DeploymentsService.POLL_RATE_MS + 10);
        discardPeriodicTasks();
    }));
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

});
