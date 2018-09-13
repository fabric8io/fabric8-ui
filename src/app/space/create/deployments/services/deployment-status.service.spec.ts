import { TestBed } from '@angular/core/testing';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';

import { createMock } from 'testing/mock';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit } from '../models/memory-unit';
import { PodPhase } from '../models/pod-phase';
import { Pods } from '../models/pods';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from './deployment-status.service';
import { DeploymentsService } from './deployments.service';

type TestContext = {
  service: DeploymentStatusService;
  deploymentsService: jasmine.SpyObj<DeploymentsService>;
};

describe('DeploymentStatusService', (): void => {

  const spaceId: string = 'mockSpaceId';
  const environmentName: string = 'mockEnvName';
  const applicationName: string = 'mockAppName';

  beforeEach(function(this: TestContext): void {
    TestBed.configureTestingModule({
      providers: [
        DeploymentStatusService,
        {
          provide: DeploymentsService, useFactory: (): jasmine.SpyObj<DeploymentsService> => {
            const svc: jasmine.SpyObj<DeploymentsService> = createMock(DeploymentsService);
            svc.getDeploymentCpuStat.and.returnValue(new BehaviorSubject<CpuStat[]>([{ used: 3, quota: 10 }]));
            svc.getDeploymentMemoryStat.and.returnValue(new BehaviorSubject<MemoryStat[]>([{ used: 4, quota: 10, units: MemoryUnit.GB }]));
            svc.getPods.and.returnValue(new BehaviorSubject<Pods>({ total: 1, pods: [[PodPhase.RUNNING, 1]] }));
            svc.getEnvironmentCpuStat.and.returnValue(new BehaviorSubject<CpuStat>({ used: 3, quota: 10 }));
            svc.getEnvironmentMemoryStat.and.returnValue(new BehaviorSubject<MemoryStat>({ used: 4, quota: 10, units: MemoryUnit.GB }));
            return svc;
          }
        }
      ]
    });

    this.deploymentsService = TestBed.get(DeploymentsService);
    this.service = TestBed.get(DeploymentStatusService);
  });

  describe('#getDeploymentAggregateStatus', (): void => {
    it('should return OK status with no message when no stats are nearing quota', function(this: TestContext, done: DoneFn): void {
      this.service.getDeploymentAggregateStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.OK);
          expect(status.message).toEqual('');
          done();
        });
    });

    it('should mirror single status when one stat is nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 9, quota: 10 }]);
      combineLatest(
        this.service.getDeploymentCpuStatus('foo', 'bar', 'baz'),
        this.service.getDeploymentAggregateStatus('foo', 'bar', 'baz')
      ).pipe(
        first()
      ).subscribe((statuses: [Status, Status]): void => {
          expect(statuses[1]).toEqual(statuses[0]);
          done();
        });
    });

    it('should return combined status when multiple stats are nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 9, quota: 10 }]);
      this.deploymentsService.getDeploymentMemoryStat().next([{ used: 9, quota: 10, units: MemoryUnit.MB }]);
      this.service.getDeploymentAggregateStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.WARN);
          expect(status.message).toEqual('CPU usage is nearing capacity. Memory usage is nearing capacity.');
          done();
        });
    });

    it('should return combined status when multiple stats are nearing or at quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 9, quota: 10 }]);
      this.deploymentsService.getDeploymentMemoryStat().next([{ used: 10, quota: 10, units: MemoryUnit.MB }]);
      this.service.getDeploymentAggregateStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('CPU usage is nearing capacity. Memory usage has reached capacity.');
          done();
        });
    });
  });

  describe('#getDeploymentCpuStatus', (): void => {
    it('should correctly invoke the deployments service', function(this: TestContext): void {
      this.service.getDeploymentCpuStatus(spaceId, environmentName, applicationName);
      expect(this.deploymentsService.getPods).toHaveBeenCalledWith(spaceId, environmentName, applicationName);
      expect(this.deploymentsService.getDeploymentCpuStat).toHaveBeenCalledWith(spaceId, environmentName, applicationName, 1);
    });

    it('should return OK status when not nearing quota', function(this: TestContext, done: DoneFn): void {
      this.service.getDeploymentCpuStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.OK);
          expect(status.message).toEqual('');
          done();
        });
    });

    it('should return WARN status when nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 9, quota: 10 }]);
      this.service.getDeploymentCpuStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.WARN);
          expect(status.message).toEqual('CPU usage is nearing capacity.');
          done();
        });
    });

    it('should return ERR status when at quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 10, quota: 10 }]);
      this.service.getDeploymentCpuStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('CPU usage has reached capacity.');
          done();
        });
    });

    it('should return OK status after scaling down to 0 pods', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentCpuStat().next([{ used: 10, quota: 10 }]);
      this.service.getDeploymentCpuStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('CPU usage has reached capacity.');
          this.deploymentsService.getPods().next({ total: 0, pods: [] });
          this.deploymentsService.getDeploymentCpuStat().next([{ used: 0, quota: 0 }]);
          this.service.getDeploymentCpuStatus('foo', 'bar', 'baz').pipe(
            first()
          ).subscribe((status: Status): void => {
              expect(status.type).toEqual(StatusType.OK);
              expect(status.message).toEqual('');
              done();
            });
        });
    });
  });

  describe('#getDeploymentMemoryStatus', (): void => {
    it('should correctly invoke the deployments service', function(this: TestContext): void {
      this.service.getDeploymentMemoryStatus(spaceId, environmentName, applicationName);
      expect(this.deploymentsService.getPods).toHaveBeenCalledWith(spaceId, environmentName, applicationName);
      expect(this.deploymentsService.getDeploymentMemoryStat).toHaveBeenCalledWith(spaceId, environmentName, applicationName, 1);
    });

    it('should return OK status when not nearing quota', function(this: TestContext, done: DoneFn): void {
      this.service.getDeploymentMemoryStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.OK);
          expect(status.message).toEqual('');
          done();
        });
    });

    it('should return WARN status when nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentMemoryStat().next([{ used: 9, quota: 10, units: MemoryUnit.MB }]);
      this.service.getDeploymentMemoryStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.WARN);
          expect(status.message).toEqual('Memory usage is nearing capacity.');
          done();
        });
    });

    it('should return ERR status when at quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentMemoryStat().next([{ used: 10, quota: 10, units: MemoryUnit.MB }]);
      this.service.getDeploymentMemoryStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('Memory usage has reached capacity.');
          done();
        });
    });

    it('should return OK status after scaling down to 0 pods', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getDeploymentMemoryStat().next([{ used: 10, quota: 10, units: MemoryUnit.MB }]);
      this.service.getDeploymentMemoryStatus('foo', 'bar', 'baz').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('Memory usage has reached capacity.');
          this.deploymentsService.getPods().next({ total: 0, pods: [] });
          this.deploymentsService.getDeploymentMemoryStat().next([{ used: 0, quota: 0, units: MemoryUnit.MB }]);
          this.service.getDeploymentMemoryStatus('foo', 'bar', 'baz').pipe(
            first()
          ).subscribe((status: Status): void => {
              expect(status.type).toEqual(StatusType.OK);
              expect(status.message).toEqual('');
              done();
            });
        });
    });
  });

  describe('getEnvironmentCpuStatus', (): void => {
    it('should correctly invoke the deployments service', function(this: TestContext): void {
      this.service.getEnvironmentCpuStatus(spaceId, environmentName);
      expect(this.deploymentsService.getEnvironmentCpuStat).toHaveBeenCalledWith(spaceId, environmentName);
    });

    it('should return OK status when not nearing quota', function(this: TestContext, done: DoneFn): void {
      this.service.getEnvironmentCpuStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.OK);
          expect(status.message).toEqual('');
          done();
        });
    });

    it('should return WARN status when nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getEnvironmentCpuStat().next({ used: 9, quota: 10 });
      this.service.getEnvironmentCpuStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.WARN);
          expect(status.message).toEqual('CPU usage is nearing capacity.');
          done();
        });
    });

    it('should return ERR status when at quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getEnvironmentCpuStat().next({ used: 10, quota: 10 });
      this.service.getEnvironmentCpuStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('CPU usage has reached capacity.');
          done();
        });
    });
  });

  describe('getEnvironmentMemoryStatus', (): void => {
    it('should correctly invoke the deployments service', function(this: TestContext): void {
      this.service.getEnvironmentMemoryStatus(spaceId, environmentName);
      expect(this.deploymentsService.getEnvironmentMemoryStat).toHaveBeenCalledWith(spaceId, environmentName);
    });

    it('should return OK status when not nearing quota', function(this: TestContext, done: DoneFn): void {
      this.service.getEnvironmentMemoryStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.OK);
          expect(status.message).toEqual('');
          done();
        });
    });

    it('should return WARN status when nearing quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getEnvironmentMemoryStat().next({ used: 9, quota: 10, units: MemoryUnit.GB });
      this.service.getEnvironmentMemoryStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.WARN);
          expect(status.message).toEqual('Memory usage is nearing capacity.');
          done();
        });
    });

    it('should return ERR status when at quota', function(this: TestContext, done: DoneFn): void {
      this.deploymentsService.getEnvironmentMemoryStat().next({ used: 10, quota: 10, units: MemoryUnit.GB });
      this.service.getEnvironmentMemoryStatus('foo', 'bar').pipe(
        first()
      ).subscribe((status: Status): void => {
          expect(status.type).toEqual(StatusType.ERR);
          expect(status.message).toEqual('Memory usage has reached capacity.');
          done();
        });
    });
  });

});
