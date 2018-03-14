import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ActionModule,
  EmptyStateModule,
  ListModule
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
  ContextType,
  Space
} from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

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
}

@Component({
  selector: 'codebases-item',
  template: ''
})
class FakeCodebasesItem {
  @Input() cheState: Che;
  @Input() codebase: Codebase;
  @Input() index: number;
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

describe('CodebasesComponent', () => {
  type TestingContext = TestContext<CodebasesComponent, HostComponent>;

  let component: CodebasesComponent;
  let fixture: ComponentFixture<CodebasesComponent>;

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

  beforeAll(() => {
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
        details.created_at = '123';
        details.pushed_at = '456';
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
      { provide: ProviderService, useFactory: () => providerService }
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
      ListModule,
      RouterTestingModule.withRoutes([])
    ]
  });

  describe('GitHub repo details', () => {
    it('should filter Codebases where GitHub repo no longer exists', function(this: TestingContext) {
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
      expect(this.testedDirective.allCodebases.length).toEqual(1);
      const codebase: Codebase = this.testedDirective.allCodebases[0];
      expect(codebase.attributes.url).toEqual('https://github.com/foo-org/foo-project.git');
      expect(codebase.gitHubRepo.htmlUrl).toEqual('https://github.com/foo-org/foo-project/html');
      expect(codebase.gitHubRepo.fullName).toEqual('Foo Project');
      expect(codebase.gitHubRepo.createdAt).toEqual('123');
      expect(codebase.gitHubRepo.pushedAt).toEqual('456');
    });
  });

});
