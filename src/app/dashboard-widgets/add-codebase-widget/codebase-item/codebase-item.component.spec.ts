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
  initContext
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

  let gitHubService: jasmine.SpyObj<GitHubService>;

  beforeEach(function(): void {
    gitHubService = createMock(GitHubService);
    gitHubService.getRepoDetailsByUrl.and.returnValue(new Subject<GitHubRepoDetails>());
    TestBed.overrideProvider(GitHubService, { useValue: gitHubService });
  });

  const testContext = initContext(CodebaseItemComponent, HostComponent, {
    declarations: [
      MockCodebasesItemWorkspacesComponent,
      MockFeatureToggleComponent
    ]
  });

  it('should receive provided Codebase', function(): void {
    expect(testContext.testedDirective.codebase).toBe(testContext.hostComponent.codebase);
  });

  it('should provide codebase to child codebases-item-workspaces component', function(): void {
    const child: MockCodebasesItemWorkspacesComponent = testContext.tested.query(By.directive(MockCodebasesItemWorkspacesComponent)).componentInstance;
    expect(child.codebase).toBe(testContext.testedDirective.codebase);
  });

  describe('lastUpdated', () => {
    it('should emit the pushed_at property of the GitHubRepoDetails', function(done: DoneFn): void {
      const pushed_at: string = '2018-09-07T20:15:52.465Z';
      testContext.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual(new Date(pushed_at).toString());
        done();
      });
      gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if pushed_at is an invalid date string', function(done: DoneFn): void {
      const pushed_at: string = 'invalid date';
      testContext.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if pushed_at is undefined', function(done: DoneFn): void {
      const pushed_at: string = undefined;
      testContext.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      gitHubService.getRepoDetailsByUrl().next({ pushed_at });
    });

    it('should emit empty string if request produces an error', function(done: DoneFn): void {
      testContext.testedDirective.lastUpdated.pipe(first()).subscribe((lastUpdated: string): void => {
        expect(lastUpdated).toEqual('');
        done();
      });
      gitHubService.getRepoDetailsByUrl().error('some error');
    });
  });

});
