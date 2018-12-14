import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MySpacesItemHeadingComponent } from './my-spaces-item-heading.component';

describe('My Spaces Item Heading Component', () => {
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MySpacesItemHeadingComponent],
      providers: [],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(MySpacesItemHeadingComponent);
  });

  it('Init component succesfully', async(() => {
    let comp = fixture.componentInstance;
    let debug = fixture.debugElement;
    fixture.detectChanges();
    let element = debug.queryAll(By.css('.list-pf-title'));
    fixture.whenStable().then(() => {
      expect(element.length).toEqual(1);
    });
  }));
});
