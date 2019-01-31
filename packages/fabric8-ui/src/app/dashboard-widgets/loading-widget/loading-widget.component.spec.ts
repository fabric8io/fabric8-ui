import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { initContext, TestContext } from 'testing/test-context';
import { LoadingWidgetComponent } from './loading-widget.component';

@Component({
  template:
    '<fabric8-loading-widget [message]="\'test1\'" [title]="\'test2\'"></fabric8-loading-widget>',
})
class HostComponent {}

describe('LoadingWidgetComponent', () => {
  type TestingContext = TestContext<LoadingWidgetComponent, HostComponent>;

  beforeEach(() => {});

  const testContext = initContext(LoadingWidgetComponent, HostComponent, {
    imports: [CommonModule],
  });

  describe('Loading widget', () => {
    it('Should have message', () => {
      testContext.detectChanges();
      expect(testContext.testedDirective.message).toEqual('test1');
    });

    it('Should have message title', () => {
      testContext.detectChanges();
      expect(testContext.testedDirective.title).toEqual('test2');
    });
  });
});
