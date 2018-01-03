import {
  discardPeriodicTasks,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { Environment } from '../models/environment';

import { DeploymentsService } from './deployments.service';

describe('DeploymentsService', () => {

  let svc: DeploymentsService;

  beforeEach(() => {
    svc = new DeploymentsService();
  });

  describe('#getApplications', () => {
    it('should publish faked application IDs', fakeAsync(() => {
      svc.getApplications('foo')
        .subscribe(val => {
          expect(val).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', fakeAsync(() => {
      svc.getEnvironments('foo')
        .subscribe(val => {
          expect(val).toEqual([
            { name: 'stage' } as Environment,
            { name: 'run' } as Environment
          ]);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for vertx-hello in \'stage\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-hello', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be true for vertx-hello in \'run\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-hello', 'run')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be true for vertx-paint in \'stage\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-paint', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be false for vertx-paint in \'run\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-paint', 'run')
        .subscribe((active: boolean) => {
          expect(active).toBeFalsy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be true for vertx-wiki in \'run\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-wiki', 'run')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be false for vertx-wiki in \'stage\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-wiki', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeFalsy();
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

  describe('#getCpuStat', () => {
    it('should return a "quota" value of 10', fakeAsync(() => {
      svc.getCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.quota).toBe(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 1 and 10', fakeAsync(() => {
      svc.getCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(1);
          expect(val.used).toBeLessThanOrEqual(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getMemoryStat', () => {
    it('should return a "quota" value of 256', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.quota).toBe(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 100 and 256', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(100);
          expect(val.used).toBeLessThanOrEqual(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a value in MB', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.units).toEqual('MB');
        });
        tick(DeploymentsService.POLL_RATE_MS + 10);
        discardPeriodicTasks();
    }));
  });

});
