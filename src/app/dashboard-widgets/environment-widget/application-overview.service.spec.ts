import {
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { createMock } from 'testing/mock';

import { Observable } from 'rxjs';

import { DeploymentApiService } from '../../space/create/deployments/services/deployment-api.service';
import {
  ApplicationAttributesOverview,
  ApplicationOverviewService
} from './application-overview.service';

describe('ApplicationOverviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DeploymentApiService, useValue: createMock(DeploymentApiService) },
        ApplicationOverviewService
      ]
    });
  });

  it('should return data from backend', (done: DoneFn): void => {
    const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
    apiSvc.getApplications.and.returnValue(Observable.of([
      {
        attributes: {
          name: 'foo-app',
          deployments: [
            {
              attributes: {
                name: 'stage',
                version: '1'
              },
              links: {
                application: 'foo-app-stage-url'
              }
            }
          ]
        }
      },
      {
        attributes: {
          name: 'bar-app',
          deployments: [
            {
              attributes: {
                name: 'run',
                version: '2'
              },
              links: {
                application: 'bar-app-run-url'
              }
            }
          ]
        }
      }
    ]));

    const svc: ApplicationOverviewService = TestBed.get(ApplicationOverviewService);
    svc.getAppsAndEnvironments('foo-spaceId')
      .subscribe(
        (overviews: ApplicationAttributesOverview[]): void => {
          expect(apiSvc.getApplications).toHaveBeenCalledWith('foo-spaceId');
          expect(overviews).toEqual([
            {
              appName: 'bar-app',
              deploymentsInfo: [
                {
                  name: 'run',
                  version: '2',
                  url: 'bar-app-run-url'
                }
              ]
            },
            {
              appName: 'foo-app',
              deploymentsInfo: [
                {
                  name: 'stage',
                  version: '1',
                  url: 'foo-app-stage-url'
                }
              ]
            }
          ] as any[]);
          done();
        },
        done.fail
      );
  });

  it('should start immediately and then poll on a 10-second interval', fakeAsync(() => {
    const apiSvc: jasmine.SpyObj<DeploymentApiService> = TestBed.get(DeploymentApiService);
    apiSvc.getApplications.and.returnValue(Observable.of([]));

    let emissions: number = 0;
    const svc: ApplicationOverviewService = TestBed.get(ApplicationOverviewService);
    svc.getAppsAndEnvironments('foo')
      .subscribe((overviews: ApplicationAttributesOverview[]): void => {
        expect(overviews).toEqual([]);
        emissions++;
        expect(apiSvc.getApplications.calls.count()).toEqual(emissions);
      });

    expect(emissions).toBe(0);
    tick();
    expect(emissions).toBe(1);
    tick(10000);
    expect(emissions).toBe(2);
    tick(10000);
    expect(emissions).toBe(3);
    tick(10000);
    expect(emissions).toBe(4);

    svc.ngOnDestroy();
  }));
});
