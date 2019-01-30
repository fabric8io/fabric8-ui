import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AreaSizeDirective } from './area-size.directive';

@Component({
  selector: 'my-test-component',
  template: '<textarea textAreaResize class="editor-box editor-markdown">{{content}}</textarea>',
})
class TestComponent {
  content: string = '';
}

describe('area-size directive: ', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let textarea: HTMLTextAreaElement;
  let autosize: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, AreaSizeDirective],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    textarea = fixture.nativeElement.querySelector('textarea');
    autosize = fixture.debugElement.query(By.directive(AreaSizeDirective));
  });

  it('textarea should have equal content height', () => {
    expect(textarea.clientHeight).toEqual(textarea.scrollHeight);

    fixture.componentInstance.content = `
     Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat`;
    autosize.triggerEventHandler('input', null);
    fixture.detectChanges();
    expect(textarea.clientHeight).toEqual(textarea.scrollHeight);
  });

  it('the component should be identified by the directive', () => {
    expect(autosize).toBeDefined();
  });
});
