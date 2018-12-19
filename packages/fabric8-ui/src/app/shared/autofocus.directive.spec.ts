import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from './autofocus.directive';

@Component({
  selector: 'my-test-component',
  template: '',
})
class TestComponent {}

describe('autofocus directive: ', () => {
  let fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, AutofocusDirective],
    });
  });

  it('the component should be identified by the directive', async(() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: '<input afinput [autofocus]="true" id="autoforcus-input" />',
      },
    });
    const fixture = TestBed.createComponent(TestComponent);
    const directiveEl = fixture.debugElement.query(By.css('#autoforcus-input'));
    spyOn(directiveEl.nativeElement, 'focus');
    expect(directiveEl).not.toBeNull();
    fixture.detectChanges();
    setTimeout(() => {
      expect(directiveEl.nativeElement.focus).toHaveBeenCalled();
    }, 200);
  }));
});
