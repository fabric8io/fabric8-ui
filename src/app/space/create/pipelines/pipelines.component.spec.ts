import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Broadcaster } from 'ngx-base';
import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  TooltipConfig,
  TooltipModule
} from 'ngx-bootstrap/tooltip';
import {
  Context,
  Contexts
} from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import { ToolbarModule } from 'patternfly-ng/toolbar';

import { BuildConfig } from '../../../../a-runtime-console/index';

import { RouterTestingModule } from '@angular/router/testing';
import { PipelinesComponent } from './pipelines.component';
import { PipelinesService } from './services/pipelines.service';

@Component({
  selector: 'fabric8-pipelines-list',
  template: ''
})
class FakePipelinesListComponent {
  @Input() loading: boolean;
  @Input() pipelines: BuildConfig[];
}

@Component({
  template: '<alm-pipelines></alm-pipelines>'
})
class HostComponent { }

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
            name: 'space'
          }
        }
      } as Context),
      recent: Observable.never(),
      default: Observable.never()
    };

    authenticationService = createMock(AuthenticationService);
    authenticationService.getGitHubToken.and.returnValue('some-token');

    pipelinesService.getCurrentPipelines.and.returnValue(
      Observable.of([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app3',
          name: 'app3',
          gitUrl: 'https://example.com/app3.git',
          labels: {
            space: 'space2'
          }
        }
      ])
    );
    broadcaster = { broadcast: jasmine.createSpy('broadcast') };
  });

  initContext(PipelinesComponent, HostComponent, {
    imports: [
      BsDropdownModule.forRoot(),
      CommonModule,
      RouterTestingModule,
      ToolbarModule,
      ModalModule.forRoot(),
      TooltipModule.forRoot()
    ],
    declarations: [
      FakePipelinesListComponent
    ],
    providers: [
      BsDropdownConfig,
      TooltipConfig,
      { provide: Contexts, useFactory: () => contexts },
      { provide: AuthenticationService, useFactory: () => authenticationService },
      { provide: PipelinesService, useFactory: () => pipelinesService },
      { provide: Broadcaster, useFactory: () => broadcaster }
    ]
  });

  describe('Pipelines component with url', () => {
    beforeAll(() => {
      pipelinesService.getOpenshiftConsoleUrl.and.returnValue(Observable.of('http://example.com/browse/openshift'));
    });

    it('should set OpenShift Console URL', function(this: TestingContext) {
      expect(this.testedDirective.consoleAvailable).toBeTruthy();
      expect(this.testedDirective.openshiftConsoleUrl).toEqual('http://example.com/browse/openshift');
    });
  });


  describe('Pipelines component with empty url', () => {
    beforeAll(() => {
      pipelinesService.getOpenshiftConsoleUrl.and.returnValue(Observable.of(''));
    });

    it('should hide OpenShift Console URL', function(this: TestingContext) {
      expect(this.testedDirective.consoleAvailable).toBeFalsy();
      expect(this.testedDirective.openshiftConsoleUrl).toEqual('');
    });
  });

  it('should only display pipelines within the current space', function(this: TestingContext) {
    expect(this.testedDirective.pipelines as any[]).toContain({
      id: 'app',
      name: 'app',
      gitUrl: 'https://example.com/app.git',
      interestingBuilds: [
        {
          buildNumber: 1
        },
        {
          buildNumber: 2
        }
      ],
      labels: {
        space: 'space'
      }
    });
    expect(this.testedDirective.pipelines as any[]).toContain({
      id: 'app2',
      name: 'app2',
      gitUrl: 'https://example.com/app2.git',
      labels: {
        space: 'space'
      }
    });
    expect(this.testedDirective.pipelines as any[]).not.toContain({
      id: 'app3',
      name: 'app3',
      gitUrl: 'https://example.com/app3.git',
      labels: {
        space: 'space2'
      }
    });
  });

  describe('filtering', () => {
    it('should filter by application', function(this: TestingContext) {
      this.testedDirective.filterChange(
        {
          appliedFilters: [
            {
              field: {
                id: 'application',
                title: 'Application',
                placeholder: 'Filter by Application...',
                type: 'text'
              },
              value: 'app2'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
        name: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);
    });

    it('should filter by codebase', function(this: TestingContext) {
      this.testedDirective.filterChange(
        {
          appliedFilters: [
            {
              field: {
                id: 'codebase',
                title: 'Codebase',
                placeholder: 'Filter by Codebase...',
                type: 'text'
              },
              value: 'https://example.com/app2.git'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
        name: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);
    });

    it('should display all pipelines in space when filters cleared', function(this: TestingContext) {
      this.testedDirective.filterChange(
        {
          appliedFilters: [
            {
              field: {
                id: 'codebase',
                title: 'Codebase',
                placeholder: 'Filter by Codebase...',
                type: 'text'
              },
              value: 'https://example.com/app2.git'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
        name: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }]);

      this.testedDirective.filterChange({ appliedFilters: [] });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);
    });
  });

  describe('sorting', () => {
    it('should sort by application descending', function(this: TestingContext) {
      this.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha'
        },
        isAscending: false
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        }
      ]);
    });

    it('should sort by application ascending', function(this: TestingContext) {
      this.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha'
        },
        isAscending: true
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
    });

    it('should sort by codebase descending', function(this: TestingContext) {
      this.testedDirective.sortChange({
        field: {
          id: 'codebase',
          title: 'Codebase',
          sortType: 'alpha'
        },
        isAscending: false
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        }
      ]);
    });

    it('should sort by codebase ascending', function(this: TestingContext) {
      this.testedDirective.sortChange({
        field: {
          id: 'codebase',
          title: 'Codebase',
          sortType: 'alpha'
        },
        isAscending: true
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
    });

    it('should sort after filters change', function(this: TestingContext) {
      this.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha'
        },
        isAscending: true
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);

      this.testedDirective.sortChange({
        field: {
          id: 'application',
          title: 'Application',
          sortType: 'alpha'
        },
        isAscending: false
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        }
      ]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);

      this.testedDirective.filterChange(
        {
          appliedFilters: [
            {
              field: {
                id: 'application',
                title: 'Application',
                placeholder: 'Filter by Application...',
                type: 'text'
              },
              value: 'app2'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(1);

      this.testedDirective.filterChange({
        appliedFilters: []
      });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app2',
          name: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          name: 'app',
          gitUrl: 'https://example.com/app.git',
          interestingBuilds: [
            {
              buildNumber: 1
            },
            {
              buildNumber: 2
            }
          ],
          labels: {
            space: 'space'
          }
        }
      ]);
      expect(this.testedDirective.toolbarConfig.filterConfig.resultsCount).toEqual(2);
    });
  });

  it('should trigger showAddAppOverlay on click', function(this: TestingContext) {
    // given
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(this.fixture.nativeElement.querySelector('#appLauncherAnchor')).toBeDefined();
      this.fixture.nativeElement.querySelector('#appLauncherAnchor').click();
      expect(this.testedDirective.showAddAppOverlay).toHaveBeenCalled();
    });
  });

  it('should add queryParams to URL on filter change', function(this: TestingContext, done) {
    spyOn(this.testedDirective, 'addQueryParams');
    this.testedDirective.filterChange(
      {
        appliedFilters: [
          {
            field: {
              id: 'application',
              title: 'Application',
              placeholder: 'Filter by Application...',
              type: 'text'
            },
            value: 'app2'
          }
        ]
      }
    );
    this.fixture.detectChanges();
    this.fixture.whenStable().then(() => {
      expect(this.testedDirective.addQueryParams).toHaveBeenCalled();
      done();
    });
  });
});
