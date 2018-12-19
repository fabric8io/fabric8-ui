import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';

import { Space, Spaces } from 'ngx-fabric8-wit';

import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';

import {
  ApplicationAttributesOverview,
  ApplicationOverviewService,
} from './application-overview.service';
import { EnvironmentWidgetComponent } from './environment-widget.component';

@Component({
  template: '<fabric8-environment-widget></fabric8-environment-widget>',
})
class HostComponent {}

describe('EnvironmentWidgetComponent', (): void => {
  const mockApplicationOverviewService: jasmine.SpyObj<ApplicationOverviewService> = createMock(
    ApplicationOverviewService,
  );
  const mockAppEnvsSubj: Subject<ApplicationAttributesOverview[]> = new Subject<
    ApplicationAttributesOverview[]
  >();
  mockApplicationOverviewService.getAppsAndEnvironments.and.returnValue(mockAppEnvsSubj);
  mockApplicationOverviewService.ngOnDestroy.and.stub();
  beforeEach(
    (): void => {
      TestBed.overrideProvider(ApplicationOverviewService, {
        useValue: mockApplicationOverviewService,
      });
      mockApplicationOverviewService.getAppsAndEnvironments.calls.reset();
    },
  );

  const testContext: TestContext<EnvironmentWidgetComponent, HostComponent> = initContext(
    EnvironmentWidgetComponent,
    HostComponent,
    {
      providers: [
        {
          provide: Spaces,
          useFactory: (): Spaces =>
            ({
              current: new BehaviorSubject<Space>({ id: 'foo-space-id' } as Space) as Observable<
                Space
              >,
            } as Spaces),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    },
  );

  it('should initialize', (): void => {
    expect(testContext.testedDirective).toBeTruthy();
  });

  describe('loading state', (): void => {
    it('should be loading after init', (): void => {
      expect(testContext.testedDirective.loading).toBeTruthy();
    });

    it('should not be loading after ApplicationOverviewService emission', (): void => {
      mockAppEnvsSubj.next([]);
      expect(testContext.testedDirective.loading).toBeFalsy();
    });

    it('should be loading after service emission and space change', (): void => {
      mockAppEnvsSubj.next([]);
      TestBed.get(Spaces).current.next({ id: 'foo-space-id-2' });
      expect(testContext.testedDirective.loading).toBeTruthy();
    });

    it('should not be loading after emission, space change, and subsequent emission', (): void => {
      mockAppEnvsSubj.next([]);
      TestBed.get(Spaces).current.next({ id: 'foo-space-id-2' });
      mockAppEnvsSubj.next([]);
      expect(testContext.testedDirective.loading).toBeFalsy();
    });
  });

  describe('.appInfos', (): void => {
    it('should be populated by correct service request', (done: DoneFn): void => {
      const mockData: ApplicationAttributesOverview[] = [
        {
          appName: 'application-1',
          deploymentsInfo: [
            {
              name: 'stage',
              version: '1.0.1',
              url: null,
            },
            {
              name: 'run',
              version: '1.0.0',
              url: 'http://example.com/application-1/run',
            },
          ],
        },
      ];

      testContext.testedDirective.appInfos
        .pipe(first())
        .subscribe((appInfos: ApplicationAttributesOverview[]): void => {
          expect(mockApplicationOverviewService.getAppsAndEnvironments).toHaveBeenCalledWith(
            'foo-space-id',
          );
          expect(appInfos).toEqual(mockData);
          done();
        }, done.fail);

      mockAppEnvsSubj.next(mockData);
    });

    it('should request new data when Space changes', (done: DoneFn): void => {
      testContext.testedDirective.appInfos.pipe(take(2)).subscribe(
        (): void => {},
        done.fail,
        (): void => {
          expect(mockApplicationOverviewService.getAppsAndEnvironments.calls.count()).toEqual(2);

          expect(mockApplicationOverviewService.getAppsAndEnvironments.calls.argsFor(0)).toEqual([
            'foo-space-id',
          ]);
          expect(mockApplicationOverviewService.getAppsAndEnvironments.calls.argsFor(1)).toEqual([
            'foo-space-id-2',
          ]);

          done();
        },
      );

      mockAppEnvsSubj.next([]);
      TestBed.get(Spaces).current.next({ id: 'foo-space-id-2' });
      mockAppEnvsSubj.next([]);
    });
  });
});
