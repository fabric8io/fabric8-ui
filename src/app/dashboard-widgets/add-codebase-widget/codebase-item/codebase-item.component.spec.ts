import { Component } from '@angular/core';

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

describe('AddCodebaseWidget CodebaseItemComponent', () => {

  type TestingContext = TestContext<CodebaseItemComponent, HostComponent>;
  initContext(CodebaseItemComponent, HostComponent);

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeDefined();
  });

});
