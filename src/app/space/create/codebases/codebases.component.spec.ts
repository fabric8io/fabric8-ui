import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ActionModule,
  EmptyStateModule,
  Filter,
  FilterEvent,
  FilterField,
  ListModule,
  SortEvent,
  SortField
} from 'patternfly-ng';

import {
  BehaviorSubject,
  Observable,
  Subject
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import {
  Broadcaster,
  Notifications
} from 'ngx-base';
import {
  Context,
  Contexts,
  Space
} from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { FeatureFlagModule, FeatureTogglesService } from 'ngx-feature-flag';
import { ProviderService } from '../../../shared/account/provider.service';
import { Che } from './services/che';
import { CheService } from './services/che.service';
import { CodebasesService } from './services/codebases.service';
import { GitHubService } from './services/github.service';

import { CodebasesComponent } from './codebases.component';
import { Codebase } from './services/codebase';
import { GitHubRepoDetails } from './services/github';

@Component({
  selector: 'codebases-toolbar',
  template: ''
})
class FakeCodebasesToolbar {
  @Output('onFilterChange') onFilterChange = new EventEmitter();
  @Output('onSortChange') onSortChange = new EventEmitter();
  @Input() resultsCount: number;
}

@Component({
  selector: 'codebases-item-heading',
  template: ''
})
class FakeCodebasesItemHeading {
  @Input() cheState: Che;
  @Input() cveNotify: boolean;
}

@Component({
  selector: 'codebases-item',
  template: ''
})
class FakeCodebasesItem {
  @Input() cheState: Che;
  @Input() codebase: Codebase;
  @Input() index: number;
  @Input() cveNotify: boolean;
}

@Component({
  selector: 'codebases-item-actions',
  template: ''
})
class FakeCodebasesItemActions {
  @Input() cheRunning: boolean;
  @Input() codebase: Codebase;
  @Input() index: number = -1;
}

@Component({
  selector: 'codebases-item-details',
  template: ''
})
class FakeCodebasesItemDetails {
  @Input() codebase: Codebase;
}

@Component({
  template: '<codebases></codebases>'
})
class HostComponent { }

class MockFeatureToggleService {
  getFeature(featureName: string): Observable<any> {
    return Observable.of({
      attributes: {
        enabled: true,
        userEnabled: true
      }
    });
  }
}

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
    broadcaster.on.and.callFake((event: string): Observable<any> => {
      if (event === 'CodebaseAdded') {
        return broadcastSubject;
      }
      return Observable.never();
    });

    contexts = {
      current: Observable.of({
        space: {
          id: 'foo-space'
        } as Space
      } as Context)
    } as Contexts;

    cheService = createMock(CheService);
    cheService.getState.and.returnValue(Observable.of({ running: false, multiTenant: false }));
    cheService.start.and.returnValue(Observable.of({ running: true, multiTenant: false }));

    codebasesService = createMock(CodebasesService);
    codebasesSubject = new BehaviorSubject<Codebase[]>([{
      attributes: {
        url: 'https://github.com/foo-org/foo-project.git'
      }
    } as Codebase]);
    codebasesService.getCodebases.and.returnValue(codebasesSubject);

    gitHubService = createMock(GitHubService);
    gitHubService.clearCache.and.stub();
    gitHubService.ngOnDestroy.and.stub();
    gitHubService.getRepoDetailsByUrl.and.callFake((url: string): Observable<GitHubRepoDetails> => {
      if (url === 'https://github.com/foo-org/foo-project.git') {
        const details: GitHubRepoDetails = new GitHubRepoDetails();
        details.html_url = 'https://github.com/foo-org/foo-project/html';
        details.full_name = 'Foo Project';
        details.created_at = '2011-04-07T10:12:58Z';
        details.pushed_at = '2011-04-07T10:12:58Z';
        return Observable.of(details);
      } else if (url === 'https://github.com/bar-org/bar-project.git') {
        const details: GitHubRepoDetails = new GitHubRepoDetails();
        details.html_url = 'https://github.com/foo-org/foo-project/html';
        details.full_name = 'Foo Project';
        details.created_at = '2010-04-07T10:12:58Z';
        details.pushed_at = '2010-04-07T10:12:58Z';
        return Observable.of(details);
      } else if (url === 'https://github.com/foo-org/bar-project.git') {
        return Observable.throw(new Error('404 error'));
      } else {
        throw new Error('Unexpected codebase URL');
      }
    });

    notifications = createMock(Notifications);
    notifications.message.and.stub();

    authenticationService = {
      gitHubToken: Observable.of('github-token')
    } as AuthenticationService;

    providerService = createMock(ProviderService);
    providerService.linkGitHub.and.stub();
  });

  beforeEach(async(() => {
    TestBed.overrideProvider(CheService, { useFactory: () => cheService, deps: [] });
    TestBed.overrideProvider(CodebasesService, { useFactory: () => codebasesService, deps: [] });
    TestBed.overrideProvider(GitHubService, { useFactory: () => gitHubService, deps: [] });
  }));

  initContext(CodebasesComponent, HostComponent, {
    providers: [
      { provide: Broadcaster, useFactory: () => broadcaster },
      { provide: Contexts, useFactory: () => contexts },
      { provide: Notifications, useFactory: () => notifications },
      { provide: AuthenticationService, useFactory: () => authenticationService },
      { provide: ProviderService, useFactory: () => providerService },
      { provide: FeatureTogglesService, useClass: MockFeatureToggleService }
    ],
    declarations: [
      FakeCodebasesToolbar,
      FakeCodebasesItemHeading,
      FakeCodebasesItem,
      FakeCodebasesItemActions,
      FakeCodebasesItemDetails
    ],
    imports: [
      ActionModule,
      EmptyStateModule,
      FeatureFlagModule,
      ListModule,
      RouterTestingModule.withRoutes([])
    ]
  });

  describe('GitHub repo details', () => {
    it('should handle Codebases where GitHub repo no longer exists', function(this: TestingContext) {
      broadcastSubject.next();
      codebasesSubject.next([
        {
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git'
          }
        } as Codebase,
        {
          attributes: {
            url: 'https://github.com/foo-org/bar-project.git'
          }
        } as Codebase
      ]);
      codebasesSubject.complete();

      expect(this.testedDirective.allCodebases.length).toEqual(2);

      const first: Codebase = this.testedDirective.allCodebases[0];
      expect(first.attributes.url).toEqual('https://github.com/foo-org/foo-project.git');
      expect(first.gitHubRepo.htmlUrl).toEqual('https://github.com/foo-org/foo-project/html');
      expect(first.gitHubRepo.fullName).toEqual('Foo Project');
      expect(first.gitHubRepo.createdAt).toEqual('2011-04-07T10:12:58Z');
      expect(first.gitHubRepo.pushedAt).toEqual('2011-04-07T10:12:58Z');

      const second: Codebase = this.testedDirective.allCodebases[1];
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
            url: 'https://github.com/foo-org/foo-project.git'
          }
        } as Codebase,
        {
          name: 'beta',
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git'
          }
        } as Codebase
      ]);
      codebasesSubject.complete();
    });

    it('should filter codebases by name', function(this: TestingContext) {
      expect(this.testedDirective.allCodebases.length).toEqual(2);
      expect(this.testedDirective.codebases[0].name).toBe('alpha');
      expect(this.testedDirective.codebases[1].name).toBe('beta');
      this.testedDirective.filterChange({
        appliedFilters: [
          {
            field: {
              id: 'name'
            } as FilterField,
            value: 'beta'
          } as Filter
        ]
      } as FilterEvent);

      expect(this.testedDirective.codebases.length).toEqual(1);
      expect(this.testedDirective.codebases[0].name).toBe('beta');
    });
  });

  describe('sorting codebases', () => {
    beforeEach(() => {
      broadcastSubject.next();
      codebasesSubject.next([
        {
          name: 'alpha',
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git'
          }
        } as Codebase,
        {
          name: 'beta',
          attributes: {
            url: 'https://github.com/foo-org/foo-project.git'
          }
        } as Codebase
      ]);
      codebasesSubject.complete();
    });

    it('should sort codebases by name', function(this: TestingContext) {
      expect(this.testedDirective.allCodebases.length).toEqual(2);
      expect(this.testedDirective.codebases[0].name).toBe('alpha');
      expect(this.testedDirective.codebases[1].name).toBe('beta');
      this.testedDirective.sortChange({
        field: {
          id: 'name',
          sortType: 'alpha'
        } as SortField,
        isAscending: false
      } as SortEvent);
      expect(this.testedDirective.codebases[0].name).toBe('beta');
      expect(this.testedDirective.codebases[1].name).toBe('alpha');
    });

    it('should sort codebases by repository created at', function(this: TestingContext) {
      expect(this.testedDirective.allCodebases.length).toEqual(2);
      expect(this.testedDirective.codebases[0].name).toBe('alpha');
      expect(this.testedDirective.codebases[1].name).toBe('beta');

      this.testedDirective.sortChange({
        field: {
          id: 'createdAt',
          sortType: 'numeric'
        } as SortField,
        isAscending: true
      } as SortEvent);
      expect(this.testedDirective.codebases[0].name).toBe('beta');
      expect(this.testedDirective.codebases[1].name).toBe('alpha');
    });

    it('should sort codebases by repository pushed at', function(this: TestingContext) {
      expect(this.testedDirective.allCodebases.length).toEqual(2);
      expect(this.testedDirective.codebases[0].name).toBe('alpha');
      expect(this.testedDirective.codebases[1].name).toBe('beta');

      this.testedDirective.sortChange({
        field: {
          id: 'pushedAt',
          sortType: 'numeric'
        } as SortField,
        isAscending: true
      } as SortEvent);
      expect(this.testedDirective.codebases[0].name).toBe('beta');
      expect(this.testedDirective.codebases[1].name).toBe('alpha');
    });
  });
});
