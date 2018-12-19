import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { GitHubLinkAreaComponent } from './github-link-area.component';
import { GitHubLinkAreaModule } from './github-link-area.module';

describe('GitHubLinkArea component - ', () => {
  let comp: GitHubLinkAreaComponent;
  let fixture: ComponentFixture<GitHubLinkAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, GitHubLinkAreaModule],
      declarations: [],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GitHubLinkAreaComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('Should render links from the server side rendering correctly.', () => {
    // tslint:disable-next-line:max-line-length
    comp.content = `Here is a link:
       <a href="https://github.com/patternfly/patternfly-ng/issues/127">https://github.com/patternfly/patternfly-ng/issues/127</a>
       . With some added text.`;
    // this first detectChanges() updates the component that one of the @Inputs has changed.
    fixture.detectChanges();
    // because of https://github.com/angular/angular/issues/9866, detectChanges() does not
    // call ngOnChanges() on the component (yeah, it it as broken as it sounds). So
    // we need to call the component manually to update.
    comp.updateOnChanges();
    // and because the test framework is not even able to detect inner changes to a component,
    // we need to call detectChanges() again.
    fixture.detectChanges();
    // also, using query() is also not working. Maybe sue to the dynamic update of innerHTML.
    // So we need to use the nativeElement to get a selector working.
    let elLink: Element = fixture.debugElement.nativeElement.querySelector('.gh-link');
    expect(elLink).not.toBeNull();
    // link text
    let elText: Element = elLink.querySelector('.gh-link-label');
    expect(elText).not.toBeNull();
    expect(elText.textContent).toBe(' patternfly-ng:127 ');
    // link target
    expect(elLink.attributes).not.toBeNull();
    expect(elLink.attributes.length).toBe(3);
    expect(elLink.attributes[1].name).toBe('href');
    expect(elLink.attributes[1].value).toBe(
      'https://github.com/patternfly/patternfly-ng/issues/127',
    );
    // state icon
    let elIcon: Element = elLink.querySelector('.gh-link-error');
    expect(elIcon).not.toBeNull();
  });

  it('Should render links from the client side rendering correctly.', () => {
    // tslint:disable-next-line:max-line-length
    comp.content = `Here is a link:
       <a href="https://github.com/patternfly/patternfly-ng/issues/127" rel="nofollow">https://github.com/patternfly/patternfly-ng/issues/127</a>
       . With some added text.`;
    // this first detectChanges() updates the component that one of the @Inputs has changed.
    fixture.detectChanges();
    // because of https://github.com/angular/angular/issues/9866, detectChanges() does not
    // call ngOnChanges() on the component (yeah, it it as broken as it sounds). So
    // we need to call the component manually to update.
    comp.updateOnChanges();
    // and because the test framework is not even able to detect inner changes to a component,
    // we need to call detectChanges() again.
    fixture.detectChanges();
    // also, using query() is also not working. Maybe sue to the dynamic update of innerHTML.
    // So we need to use the nativeElement to get a selector working.
    let elLink: Element = fixture.debugElement.nativeElement.querySelector('.gh-link');
    expect(elLink).not.toBeNull();
    // link text
    let elText: Element = elLink.querySelector('.gh-link-label');
    expect(elText).not.toBeNull();
    expect(elText.textContent).toBe(' patternfly-ng:127 ');
    // link target
    expect(elLink.attributes).not.toBeNull();
    expect(elLink.attributes.length).toBe(3);
    expect(elLink.attributes[1].name).toBe('href');
    expect(elLink.attributes[1].value).toBe(
      'https://github.com/patternfly/patternfly-ng/issues/127',
    );
    // state icon
    let elIcon: Element = elLink.querySelector('.gh-link-error');
    expect(elIcon).not.toBeNull();
  });
});
