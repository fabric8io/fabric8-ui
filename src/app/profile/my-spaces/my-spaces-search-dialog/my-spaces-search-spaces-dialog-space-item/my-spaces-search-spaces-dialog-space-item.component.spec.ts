import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { MySpacesSearchSpacesDialogSpaceItemComponent } from './my-spaces-search-spaces-dialog-space-item.component';

@Component({
  template: '<my-spaces-search-spaces-dialog-space-item></my-spaces-search-spaces-dialog-space-item>'
})
class HostComponent { }

describe('MySpacesSearchSpacesDialogSpaceItemComponent', () => {

  type TestingContext = TestContext<MySpacesSearchSpacesDialogSpaceItemComponent, HostComponent>;
  initContext(MySpacesSearchSpacesDialogSpaceItemComponent, HostComponent, {
    imports: [ RouterTestingModule ]
  });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeDefined();
  });

});
