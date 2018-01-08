import { By } from '@angular/platform-browser';
import {
  Component,
  DebugElement
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { WorkspaceNotFoundComponent } from './workspace-not-found.component';
import { EmptyStateModule } from 'patternfly-ng';

@Component({
  template: `<workspace-not-found (onClearAllFilters)="clearAllFilters()"></workspace-not-found>`
})
class TestHostComponent {
  clearAllFilters(): void { }
}

describe(`WorkspaceNotFoundComponent`, () => {

  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let workspaceNotFoundElement: DebugElement;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EmptyStateModule
      ],
      declarations: [
        WorkspaceNotFoundComponent,
        TestHostComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;

    spy = spyOn(testHostComponent, 'clearAllFilters');

    fixture.detectChanges();

    workspaceNotFoundElement = fixture.debugElement.query(By.css('.workspace-not-found'));
  });

  it('should compile workspace-not-found component', () => {
    expect(workspaceNotFoundElement).toBeTruthy();
  });

  it(`should raise 'onClearAllFilters' event when action is clicked`, () => {
    const clearButton = workspaceNotFoundElement.query(By.css('button[title="Clear All Filters"]'));

    clearButton.triggerEventHandler('click', null);
    expect(spy.calls.any()).toBe(true, 'testHostComponent.clearAllFilters is called');
  });

});
