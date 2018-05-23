import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { initContext, TestContext } from 'testing/test-context';

import { LoadingWidgetComponent } from './loading-widget.component';

@Component({
  template: '<fabric8-loading-widget message="test"></fabric8-loading-widget>'
})
class HostComponent {
  userOwnsSpace: boolean;
}

describe('LoadingWidgetComponent', () => {
  type TestingContext = TestContext<LoadingWidgetComponent, HostComponent>;

  beforeEach(() => {
  });

  initContext(LoadingWidgetComponent, HostComponent, {
    imports: [
      CommonModule
    ]
  });

  describe('Loading widget', () => {
    it('Should have message', function(this: TestingContext) {
      this.detectChanges();
      expect(this.testedDirective.message).toEqual('test');
    });
  });
});
