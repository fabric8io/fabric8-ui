import {
  discardPeriodicTasks,
  fakeAsync,
  tick
} from '@angular/core/testing';

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
            { environmentId: 'envId-stage', name: 'stage' },
            { environmentId: 'envId-run', name: 'run' }
          ]);
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
    it('should return a "total" value of 10', fakeAsync(() => {
      svc.getCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.total).toBe(10);
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
    it('should return a "total" value of 256', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.total).toBe(256);
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
  });

});
