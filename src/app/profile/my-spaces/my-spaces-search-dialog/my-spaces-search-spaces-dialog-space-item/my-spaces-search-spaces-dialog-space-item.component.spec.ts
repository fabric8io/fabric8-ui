import { CommonModule } from '@angular/common';
import {
  Component,
  DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import {
  initContext,
  TestContext
} from 'testing/test-context';

import { Space } from 'ngx-fabric8-wit';

import { MySpacesSearchSpacesDialogSpaceItemComponent } from './my-spaces-search-spaces-dialog-space-item.component';

@Component({
  template: '<my-spaces-search-spaces-dialog-space-item></my-spaces-search-spaces-dialog-space-item>'
})
class HostComponent { }

describe('MySpacesSearchSpacesDialogSpaceItemComponent', () => {

  type TestingContext = TestContext<MySpacesSearchSpacesDialogSpaceItemComponent, HostComponent>;
  initContext(MySpacesSearchSpacesDialogSpaceItemComponent, HostComponent,
    {
      imports: [
        CommonModule,
        RouterTestingModule
      ]
    },
    (comp: MySpacesSearchSpacesDialogSpaceItemComponent): void => {
      comp.space = {
        attributes: {
          name: 'foo-space',
          description: 'some space description'
        },
        relationalData: {
          creator: {
            attributes: {
              username: 'foo-user'
            }
          }
        }
      } as Space;
    }
  );

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeDefined();
  });

  describe('invalid (missing) creator avatar URL', () => {
    it('should load default image', function(this: TestingContext): void {
      const imgElement: DebugElement = this.tested.query(By.css('img'));
      // within test harness the src attribute is undefined (rather than set to a specific URL),
      // probably due to Webpack processing of the component template and image loader
      expect(imgElement.properties['src']).toBeUndefined();
      expect(imgElement.attributes['user-avatar']).toBeUndefined();
      expect(imgElement.attributes['default-avatar']).toBeDefined();
    });
  });

  describe('valid creator avatar URL', () => {
    beforeEach(function(this: TestingContext): void {
      // would actually be a remote URL, but for testing purposes, we will use a relative path to an existing asset to avoid 404s
      this.testedDirective.space.relationalData.creator.attributes.imageURL = '../../../../../assets/images/icon-stack-nodejs.png';
      this.detectChanges();
    });

    it('should load specified image', function(this: TestingContext): void {
      const imgElement: DebugElement = this.tested.query(By.css('img'));
      expect(imgElement.properties['src']).toEqual(this.testedDirective.space.relationalData.creator.attributes.imageURL);
      expect(imgElement.attributes['user-avatar']).toBeDefined();
      expect(imgElement.attributes['default-avatar']).toBeUndefined();
    });
  });
});
