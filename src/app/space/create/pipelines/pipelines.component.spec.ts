import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import {
  ComponentFixture,
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

import {
  BsDropdownConfig,
  BsDropdownModule
} from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  TooltipConfig,
  TooltipModule
} from 'ngx-bootstrap/tooltip';
import { AuthenticationService } from 'ngx-login-client';
import { ToolbarModule } from 'patternfly-ng';

import { BuildConfig } from 'a-runtime-console/index';
import { Broadcaster } from 'ngx-base';
import {
  Context,
  Contexts
} from 'ngx-fabric8-wit';
import { Fabric8UIConfig } from '../../../shared/config/fabric8-ui-config';
import { PipelinesService } from '../../../shared/runtime-console/pipelines.service';
import { ForgeWizardModule } from '../../forge-wizard/forge-wizard.module';
import { PipelinesComponent } from './pipelines.component';

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

  let component: PipelinesComponent;
  let fixture: ComponentFixture<PipelinesComponent>;

  let contexts: Contexts;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;
  let pipelinesService: { current: Observable<BuildConfig[]> };
  let f8uiConfig: { openshiftConsoleUrl: string };
  let broadcaster: { broadcast: Function };

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

    pipelinesService = {
      current: new BehaviorSubject<any[]>([
        {
          id: 'app',
          gitUrl: 'https://example.com/app.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app3',
          gitUrl: 'https://example.com/app3.git',
          labels: {
            space: 'space2'
          }
        }
      ])
    };

    f8uiConfig = { openshiftConsoleUrl: 'http://example.com/openshift' };

    broadcaster = { broadcast: jasmine.createSpy('broadcast') };
  });

  initContext(PipelinesComponent, HostComponent, {
    imports: [
      BsDropdownModule.forRoot(),
      CommonModule,
      ToolbarModule,
      ForgeWizardModule,
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
      { provide: Fabric8UIConfig, useFactory: () => f8uiConfig },
      { provide: Broadcaster, useFactory: () => broadcaster }
    ]
  });

  it('should set OpenShift Console URL', function(this: TestingContext) {
    expect(this.testedDirective.openshiftConsoleUrl).toEqual('http://example.com/openshift');
  });

  it('should only display pipelines within the current space', function(this: TestingContext) {
    expect(this.testedDirective.pipelines as any[]).toContain({
      id: 'app',
      gitUrl: 'https://example.com/app.git',
      labels: {
        space: 'space'
      }
    });
    expect(this.testedDirective.pipelines as any[]).toContain({
      id: 'app2',
      gitUrl: 'https://example.com/app2.git',
      labels: {
        space: 'space'
      }
    });
    expect(this.testedDirective.pipelines as any[]).not.toContain({
      id: 'app3',
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
                type: 'select',
                queries: [
                  {
                    id: 'app',
                    value: 'app'
                  },
                  {
                    id: 'app2',
                    value: 'app2'
                  }
                ]
              },
              query: {
                id: 'app2',
                value: 'app2'
              },
              value: 'app2'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
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
                type: 'select',
                queries: [
                  {
                    id: 'https://example.com/app.git',
                    value: 'https://example.com/app.git'
                  },
                  {
                    id: 'https://example.com/app2.git',
                    value: 'https://example.com/app2.git'
                  }
                ]
              },
              query: {
                id: 'https://example.com/app2.git',
                value: 'https://example.com/app2.git'
              },
              value: 'https://example.com/app2.git'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
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
                type: 'select',
                queries: [
                  {
                    id: 'https://example.com/app.git',
                    value: 'https://example.com/app.git'
                  },
                  {
                    id: 'https://example.com/app2.git',
                    value: 'https://example.com/app2.git'
                  }
                ]
              },
              query: {
                id: 'https://example.com/app2.git',
                value: 'https://example.com/app2.git'
              },
              value: 'https://example.com/app2.git'
            }
          ]
        }
      );
      expect(this.testedDirective.pipelines as any[]).toEqual([{
        id: 'app2',
        gitUrl: 'https://example.com/app2.git',
        labels: {
          space: 'space'
        }
      }]);
      this.testedDirective.filterChange({ appliedFilters: [] });
      expect(this.testedDirective.pipelines as any[]).toEqual([
        {
          id: 'app',
          gitUrl: 'https://example.com/app.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
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
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          gitUrl: 'https://example.com/app.git',
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
          gitUrl: 'https://example.com/app.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
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
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app',
          gitUrl: 'https://example.com/app.git',
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
          gitUrl: 'https://example.com/app.git',
          labels: {
            space: 'space'
          }
        },
        {
          id: 'app2',
          gitUrl: 'https://example.com/app2.git',
          labels: {
            space: 'space'
          }
        }
      ]);
    });
  });

});
