import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Broadcaster } from 'ngx-base';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { ToolbarModule } from 'patternfly-ng/toolbar';
import { BehaviorSubject, never as observableNever, Observable, of as observableOf } from 'rxjs';
import { createMock } from 'testing/mock';
import { initContext, TestContext } from 'testing/test-context';
import { BuildConfig } from '../../../../a-runtime-console/index';
import { PipelinesComponent } from './pipelines.component';
import { PipelinesService } from './services/pipelines.service';

@Component({
  selector: 'fabric8-pipelines-list',
  template: '',
})
class FakePipelinesListComponent {
  @Input() loading: boolean;

  @Input() pipelines: BuildConfig[];
}

@Component({
  template: '<alm-pipelines></alm-pipelines>',
})
class HostComponent {}

describe('PipelinesComponent', () => {
  type TestingContext = TestContext<PipelinesComponent, HostComponent>;

  let contexts: Contexts;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let broadcaster: { broadcast: Function };

  let pipelinesService: jasmine.SpyObj<PipelinesService>;
  beforeAll(() => {
    pipelinesService = createMock(PipelinesService);
  });

  beforeEach(async(() => {
    TestBed.overrideProvider(PipelinesService, { useFactory: () => pipelinesService, deps: [] });
  }));

  beforeEach(() => {
    contexts = {
      current: new BehaviorSubject<Context>({
        name: 'space',
        path: '/user/space',
        space: {
          attributes: {
            name: 'space',
          },
        },
      } as Context),
      recent: observableNever(),
      default: observableNever(),
    };

    authenticationService = createMock(AuthenticationService);
    authenticationService.getGitHubToken.and.returnValue('some-token');

    pipelinesService.getCurrentPipelines.and.returnValue(
      observableOf([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app3',
          name: 'app3',
          gitUrl: 'https://example.com/app3.git',
          labels: {
            space: 'space2',
          },
        },
      ]),
    );
    broadcaster = { broadcast: jasmine.createSpy('broadcast') };
  });

  const testContext = initContext(PipelinesComponent, HostComponent, {
    imports: [
      BsDropdownModule.forRoot(),
      CommonModule,
      RouterTestingModule,
      ToolbarModule,
      ModalModule.forRoot(),
      TooltipModule.forRoot(),
    ],
    declarations: [FakePipelinesListComponent],
    providers: [
      BsDropdownConfig,
      TooltipConfig,
      { provide: Contexts, useFactory: () => contexts },
      { provide: AuthenticationService, useFactory: () => authenticationService },
      { provide: PipelinesService, useFactory: () => pipelinesService },
      { provide: Broadcaster, useFactory: () => broadcaster },
    ],
  });

  describe('Pipelines component with url', () => {
    beforeAll(() => {
      pipelinesService.getOpenshiftConsoleUrl.and.returnValue(
        observableOf('http://example.com/browse/openshift'),
      );
    });

    it('should set OpenShift Console URL', function() {
      expect(testContext.testedDirective.consoleAvailable).toBeTruthy();
      expect(testContext.testedDirective.openshiftConsoleUrl).toEqual(
        'http://example.com/browse/openshift',
      );
    });
  });

  describe('Pipelines component with empty url', () => {
    beforeAll(() => {
      pipelinesService.getOpenshiftConsoleUrl.and.returnValue(observableOf(''));
    });

    it('should hide OpenShift Console URL', function() {
      expect(testContext.testedDirective.consoleAvailable).toBeFalsy();
      expect(testContext.testedDirective.openshiftConsoleUrl).toEqual('');
    });
  });

  it('should only display pipelines within the current space', function() {
    expect(testContext.testedDirective.pipelines as any[]).toContainEqual({
      id: 'app',
      name: 'app',
      gitUrl: 'https://example.com/app.git',
      interestingBuilds: [
        {
          buildNumber: 1,
        },
        {
          buildNumber: 2,
        },
      ],
      labels: {
        space: 'space',
      },
    });
    expect(testContext.testedDirective.pipelines as any[]).toContainEqual({
      id: 'app2',
      name: 'app2',
      gitUrl: 'https://example.com/app2.git',
      labels: {
        space: 'space',
      },
    });
    expect(testContext.testedDirective.pipelines as any[]).not.toContainEqual({
      id: 'app3',
      name: 'app3',
      gitUrl: 'https://example.com/app3.git',
      labels: {
        space: 'space2',
      },
    });
  });

  describe('filtering', () => {
    it('should filter by application', function() {
      testContext.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'application',
              title: 'Application',
              placeholder: 'Filter by Application...',
              type: 'text',
            },
            value: 'app2',
          },
        ],
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);
    });

    it('should filter by codebase', function() {
      testContext.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'codebase',
              title: 'Codebase',
              placeholder: 'Filter by Codebase...',
              type: 'text',
            },
            value: 'https://example.com/app2.git',
          },
        ],
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);
    });

    it('should display all pipelines in space when filters cleared', function() {
      testContext.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'codebase',
              title: 'Codebase',
              placeholder: 'Filter by Codebase...',
              type: 'text',
            },
            value: 'https://example.com/app2.git',
          },
        ],
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);

      testContext.testedDirective.filterChange({ appliedFilters: [] });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);
    });
  });

  describe('sorting', () => {
    it('should sort by application descending', function() {
      testContext.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha',
        },
        isAscending: false,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
      ]);
    });

    it('should sort by application ascending', function() {
      testContext.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha',
        },
        isAscending: true,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
    });

    it('should sort by codebase descending', function() {
      testContext.testedDirective.sortChange({
        field: {
          id: 'codebase',
          title: 'Codebase',
          sortType: 'alpha',
        },
        isAscending: false,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
      ]);
    });

    it('should sort by codebase ascending', function() {
      testContext.testedDirective.sortChange({
        field: {
          id: 'codebase',
          title: 'Codebase',
          sortType: 'alpha',
        },
        isAscending: true,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
    });

    it('should sort after filters change', function() {
      testContext.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha',
        },
        isAscending: true,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);

      testContext.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha',
        },
        isAscending: false,
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);

      testContext.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'application',
              title: 'Application',
              placeholder: 'Filter by Application...',
              type: 'text',
            },
            value: 'app2',
          },
        ],
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);

      testContext.testedDirective.filterChange({
        appliedFilters: [],
      });
      expect(testContext.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space',
          },
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1,
            },
            {
              buildNumber: 2,
            },
          ],
          labels: {
            space: 'space',
          },
        },
      ]);
      expect(testContext.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);
    });
  });

  it('should trigger showAddAppOverlay on click', function(done: DoneFn) {
    // given
    spyOn(testContext.testedDirective, 'showAddAppOverlay');
    testContext.fixture.nativeElement.querySelector('.openshift-links .dropdown-toggle').click();
    testContext.fixture.detectChanges();
    testContext.fixture.whenStable().then(() => {
      expect(testContext.fixture.nativeElement.querySelector('#appLauncherAnchor')).toBeDefined();
      testContext.fixture.nativeElement.querySelector('#appLauncherAnchor').click();
      expect(testContext.testedDirective.showAddAppOverlay).toHaveBeenCalled();
      done();
    });
  });

  it('should add queryParams to URL on filter change', function(done) {
    spyOn(testContext.testedDirective, 'addQueryParams');
    testContext.testedDirective.filterChange({
      appliedFilters: [
        {
          field: {
            id: 'application',
            title: 'Application',
            placeholder: 'Filter by Application...',
            type: 'text',
          },
          value: 'app2',
        },
      ],
    });
    testContext.fixture.detectChanges();
    testContext.fixture.whenStable().then(() => {
      expect(testContext.testedDirective.addQueryParams).toHaveBeenCalled();
      done();
    });
  });
});
