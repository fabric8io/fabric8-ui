import {
  discardPeriodicTasks,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { Environment } from '../models/environment';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
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
            { name: 'test' },
            { name: 'stage' },
            { name: 'run'}
          ]);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#isApplicationDeployedInEnvironment', () => {
    it('should be true for vertx-hello in \'test\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-hello', 'test')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be false for vertx-hello in \'stage\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-hello', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeFalsy();
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

    it('should be true for vertx-paint in \'test\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-paint', 'test')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be false for vertx-paint in \'stage\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-paint', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeFalsy();
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

    it('should be false for vertx-wiki in \'test\'', fakeAsync(() => {
      svc.isApplicationDeployedInEnvironment('foo', 'vertx-wiki', 'test')
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

  describe('#isDeployedInEnvironment', () => {
    it('should be false for \'stage\'', fakeAsync(() => {
      svc.isDeployedInEnvironment('foo', 'stage')
        .subscribe((active: boolean) => {
          expect(active).toBeFalsy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be true for \'test\'', fakeAsync(() => {
      svc.isDeployedInEnvironment('foo', 'test')
        .subscribe((active: boolean) => {
          expect(active).toBeTruthy();
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should be true for \'run\'', fakeAsync(() => {
      svc.isDeployedInEnvironment('foo', 'run')
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
