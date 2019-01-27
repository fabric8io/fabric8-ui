import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Broadcaster, Notifications } from 'ngx-base';
import { Context, Contexts, Space } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';
import {
  ActionModule,
  EmptyStateModule,
  Filter,
  FilterEvent,
  FilterField,
  ListModule,
  SortEvent,
  SortField,
} from 'patternfly-ng';
import {
  BehaviorSubject,
  never as observableNever,
  Observable,
  of as observableOf,
  Subject,
  throwError as observableThrowError,
} from 'rxjs';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import { initContext, TestContext } from 'testing/test-context';
import { ProviderService } from '../../../shared/account/provider.service';
import { CodebasesComponent } from './codebases.component';
import { Che } from './services/che';
import { CheService } from './services/che.service';
import { Codebase } from './services/codebase';
import { CodebasesService } from './services/codebases.service';
import { GitHubRepoDetails } from './services/github';
import { GitHubService } from './services/github.service';

@Component({
  selector: 'codebases-toolbar',
  template: '',
})
class FakeCodebasesToolbar {
  @Output('onFilterChange') onFilterChange = new EventEmitter();

  @Output('onSortChange') onSortChange = new EventEmitter();

  @Input() resultsCount: number;
}

@Component({
  selector: 'codebases-item-heading',
  template: '',
})
class FakeCodebasesItemHeading {
  @Input() cheState: Che;

  @Input() cveNotify: boolean;
}

@Component({
  selector: 'codebases-item',
  template: '',
})
class FakeCodebasesItem {
  @Input() cheState: Che;

  @Input() codebase: Codebase;

  @Input() index: number;

  @Input() cveNotify: boolean;
}

@Component({
  selector: 'codebases-item-actions',
  template: '',
})
class FakeCodebasesItemActions {
  @Input() cheRunning: boolean;

  @Input() codebase: Codebase;

  @Input() index: number = -1;
}

@Component({
  selector: 'codebases-item-details',
  template: '',
})
class FakeCodebasesItemDetails {
  @Input() codebase: Codebase;
}

@Component({
  template: '<codebases></codebases>',
})
class HostComponent {}

describe('CodebasesComponent', () => {
  type TestingContext = TestContext<CodebasesComponent, HostComponent>;

  let broadcaster: jasmine.SpyObj<Broadcaster>;
  let broadcastSubject: Subject<any>;

  let contexts: Contexts;

  let cheService: jasmine.SpyObj<CheService>;

  let codebasesService: jasmine.SpyObj<CodebasesService>;
  let codebasesSubject: Subject<Codebase[]>;

  let gitHubService: jasmine.SpyObj<GitHubService>;

  let notifications: jasmine.SpyObj<Notifications>;

  let authenticationService: AuthenticationService;

  let providerService: jasmine.SpyObj<ProviderService>;

  beforeEach(() => {
    broadcaster = createMock(Broadcaster);
    broadcastSubject = new Subject<any>();
    broadcaster.on.and.callFake(
      (event: string): Observable<any> => {
        if (event === 'CodebaseAdded') {
          return broadcastSubject;
        }
        return observableNever();
      },
    );

    contexts = {
      current: observableOf({
        space: {
          id: 'foo-space',
        } as Space,
      } as Context),
    } as Contexts;

    cheService = createMock(CheService);
    cheService.getState.and.returnValue(observableOf({ running: false, multiTenant: false }));
    cheService.start.and.returnValue(observableOf({ running: true, multiTenant: false }));

    codebasesService = createMock(CodebasesService);
    codebasesSubject = new BehaviorSubject<Codebase[]>([
      {
        attributes: {
          url: 'https://github.com/foo-org/foo-project.git',
        },
      } as Codebase,
    ]);
    codebasesService.getCodebases.and.returnValue(codebasesSubject);

    gitHubService = createMock(GitHubService);
    gitHubService.clearCache.and.stub();
    gitHubService.getRepoDetailsByUrl.and.callFake(
      (url: string): Observable<GitHubRepoDetails> => {
        if (url === 'https://github.com/foo-org/foo-project.git') {
          const details: GitHubRepoDetails = new GitHubRepoDetails();
          details.html_url = 'https://github.com/foo-org/foo-project/html';
          details.full_name = 'Foo Project';
          details.created_at = '2011-04-07T10:12:58Z';
          details.pushed_at = '2011-04-07T10:12:58Z';
          return observableOf(details);
        }
        if (url === 'https://github.com/bar-org/bar-project.git') {
          const details: GitHubRepoDetails = new GitHubRepoDetails();
          details.html_url = 'https://github.com/bar-org/bar-project/html';
          details.full_name = 'Foo Project';
          details.created_at = '2010-04-07T10:10:58Z';
          details.pushed_at = '2010-04-07T10:10:58Z';
          return observableOf(details);
        }
        if (url === 'https://github.com/foo-org/bar-project.git') {
          return observableThrowError(new Error('404 error'));
        }
        throw new Error('Unexpected codebase URL');
      },
    );

    notifications = createMock(Notifications);
    notifications.message.and.stub();

    authenticationService = {
      gitHubToken: observableOf('github-token'),
    } as AuthenticationService;

    providerService = createMock(ProviderService);
    providerService.linkGitHub.and.stub();
  });

  beforeEach(async(() => {
    TestBed.overrideProvider(CheService, { useFactory: () => cheService, deps: [] });
    TestBed.overrideProvider(CodebasesService, { useFactory: () => codebasesService, deps: [] });
    TestBed.overrideProvider(GitHubService, { useFactory: () => gitHubService, deps: [] });
  }));

  const testContext = initContext(CodebasesComponent, HostComponent, {
    providers: [
      { provide: Broadcaster, useFactory: () => broadcaster },
      { provide: Contexts, useFactory: () => contexts },
      { provide: Notifications, useFactory: () => notifications },
      { provide: AuthenticationService, useFactory: () => authenticationService },
      { provide: ProviderService, useFactory: () => providerService },
    ],
    declarations: [
      FakeCodebasesToolbar,
      FakeCodebasesItemHeading,
      FakeCodebasesItem,
      FakeCodebasesItemActions,
      FakeCodebasesItemDetails,
      MockFeatureToggleComponent,
    ],
    imports: [ActionModule, EmptyStateModule, ListModule, RouterTestingModule.withRoutes([])],
  });

  describe('GitHub repo details', () => {
    it('should handle Codebases where GitHub repo no longer exists', function() {
      broadcastSubject.next();
      codebasesSubject.next([
        {
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git',
          },
        } as Codebase,
        {
          attributes: {
            url: 'https://github.com/foo-org/bar-project.git',
          },
        } as Codebase,
      ]);
      codebasesSubject.complete();

      expect(testContext.testedDirective.allCodebases.length).toEqual(2);

      const first: Codebase = testContext.testedDirective.allCodebases[0];
      expect(first.attributes.url).toEqual('https://github.com/foo-org/foo-project.git');
      expect(first.gitHubRepo.htmlUrl).toEqual('https://github.com/foo-org/foo-project/html');
      expect(first.gitHubRepo.fullName).toEqual('Foo Project');
      expect(first.gitHubRepo.createdAt).toEqual('2011-04-07T10:12:58Z');
      expect(first.gitHubRepo.pushedAt).toEqual('2011-04-07T10:12:58Z');

      const second: Codebase = testContext.testedDirective.allCodebases[1];
      expect(second.attributes.url).toEqual('https://github.com/foo-org/bar-project.git');
      expect(second.gitHubRepo).not.toBeDefined();
    });
  });

  describe('filtering codebases', () => {
    beforeEach(() => {
      broadcastSubject.next();
      codebasesSubject.next([
        {
          name: 'alpha',
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git',
          },
        } as Codebase,
        {
          name: 'beta',
          attributes: {
            url: 'https://github.com/bar-org/bar-project.git',
          },
        } as Codebase,
      ]);
      codebasesSubject.complete();
    });

    it('should filter codebases by name', function() {
      expect(testContext.testedDirective.allCodebases.length).toEqual(2);
      expect(testContext.testedDirective.codebases[0].name).toBe('alpha');
      expect(testContext.testedDirective.codebases[1].name).toBe('beta');
      testContext.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'name',
            } as FilterField,
            value: 'beta',
          } as Filter,
        ],
      } as FilterEvent);

      expect(testContext.testedDirective.codebases.length).toEqual(1);
      expect(testContext.testedDirective.codebases[0].name).toBe('beta');
    });
  });

  describe('sorting codebases', () => {
    beforeEach(() => {
      broadcastSubject.next();
      codebasesSubject.next([
        {
          name: 'alpha',
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git',
          },
        } as Codebase,
        {
          name: 'beta',
          attributes: {
            url: 'https://github.com/bar-org/bar-project.git',
          },
        } as Codebase,
      ]);
      codebasesSubject.complete();
    });

    it('should sort codebases by name', function() {
      expect(testContext.testedDirective.allCodebases.length).toEqual(2);
      expect(testContext.testedDirective.codebases[0].name).toBe('alpha');
      expect(testContext.testedDirective.codebases[1].name).toBe('beta');
      testContext.testedDirective.sortChange({
        field: {
          id: 'name',
          sortType: 'alpha',
        } as SortField,
        isAscending: false,
      } as SortEvent);
      expect(testContext.testedDirective.codebases[0].name).toBe('beta');
      expect(testContext.testedDirective.codebases[1].name).toBe('alpha');
    });

    it('should sort codebases by repository created at', function() {
      expect(testContext.testedDirective.allCodebases.length).toEqual(2);
      expect(testContext.testedDirective.codebases[0].name).toBe('alpha');
      expect(testContext.testedDirective.codebases[1].name).toBe('beta');

      testContext.testedDirective.sortChange({
        field: {
          id: 'createdAt',
          sortType: 'numeric',
        } as SortField,
        isAscending: true,
      } as SortEvent);
      expect(testContext.testedDirective.codebases[0].name).toBe('beta');
      expect(testContext.testedDirective.codebases[1].name).toBe('alpha');
    });

    it('should sort codebases by repository pushed at', function() {
      expect(testContext.testedDirective.allCodebases.length).toEqual(2);
      expect(testContext.testedDirective.codebases[0].name).toBe('alpha');
      expect(testContext.testedDirective.codebases[1].name).toBe('beta');

      testContext.testedDirective.sortChange({
        field: {
          id: 'pushedAt',
          sortType: 'numeric',
        } as SortField,
        isAscending: true,
      } as SortEvent);
      expect(testContext.testedDirective.codebases[0].name).toBe('beta');
      expect(testContext.testedDirective.codebases[1].name).toBe('alpha');
    });
  });
});
