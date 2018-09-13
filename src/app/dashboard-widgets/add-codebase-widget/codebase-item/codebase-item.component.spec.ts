import {
  Component,
  Input
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { Codebase } from '../../../space/create/codebases/services/codebase';
import { GitHubRepoDetails } from '../../../space/create/codebases/services/github';
import { GitHubService } from '../../../space/create/codebases/services/github.service';
import { CodebaseItemComponent } from './codebase-item.component';

@Component({
  template: `
    <fabric8-add-codebase-widget-codebase-item [codebase]="codebase"></fabric8-add-codebase-widget-codebase-item>
  `
})
class HostComponent {
  codebase: Codebase = {
    attributes: {
      last_used_workspace: 'foo-workspace',
      stackId: 'foo-stack'
    },
    type: 'mock-codebase'
  };
}

@Component({
  selector: 'codebases-item-workspaces',
  template: ''
})
class MockCodebasesItemWorkspacesComponent {
  @Input() codebase: Codebase;
}

describe('AddCodebaseWidget CodebaseItemComponent', () => {

  type TestingContext = TestContext<CodebaseItemComponent, HostComponent> & {
    gitHubService: jasmine.SpyObj<GitHubService>
  };

  beforeEach(function(this: TestingContext): void {
    this.gitHubService = createMock(GitHubService);
    this.gitHubService.getRepoDetailsByUrl.and.returnValue(new Subject<GitHubRepoDetails>());
    TestBed.overrideProvider(GitHubService, { useValue: this.gitHubService });
  });
  initContext(CodebaseItemComponent, HostComponent, {
    declarations: [
      MockCodebasesItemWorkspacesComponent,
      MockFeatureToggleComponent
    ]
  });

  it('should receive provided Codebase', function(this: TestingContext): void {
    expect(this.testedDirective.codebase).toBe(this.hostComponent.codebase);
  });

  it('should provide codebase to child codebases-item-workspaces component', function(this: TestingContext): void {
    const child: MockCodebasesItemWorkspacesComponent = this.tested.query(By.directive(MockCodebasesItemWorkspacesComponent)).componentInstance;
    expect(child.codebase).toBe(this.testedDirective.codebase);
  });

  describe('lastUpdated', () => {
    it('should emit the pushed_at property of the GitHubRepoDetails', function(this: TestingContext, done: DoneFn): void {
      const pushed_at: string = '2018-09-07T20:15:52.465Z';
      this.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual(new Date(pushed_at).toString());
        done();
      });
      this.gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if pushed_at is an invalid date string', function(this: TestingContext, done: DoneFn): void {
      const pushed_at: string = 'invalid date';
      this.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      this.gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if pushed_at is undefined', function(this: TestingContext, done: DoneFn): void {
      const pushed_at: string = undefined;
      this.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      this.gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if request produces an error', function(this: TestingContext, done: DoneFn): void {
      this.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      this.gitHubService.getRepoDetailsByUrl().error('some error');
    });
  });

});
