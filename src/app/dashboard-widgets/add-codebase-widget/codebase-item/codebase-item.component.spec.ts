import {
  Component,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { CodebaseItemComponent } from './codebase-item.component';

import { Codebase } from '../../../space/create/codebases/services/codebase';

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

  type TestingContext = TestContext<CodebaseItemComponent, HostComponent>;
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

});
