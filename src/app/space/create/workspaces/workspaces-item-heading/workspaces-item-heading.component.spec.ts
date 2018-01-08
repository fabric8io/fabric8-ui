import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  Component,
  DebugElement,
  ViewChild
} from '@angular/core';
import { HttpModule } from '@angular/http';
import {
  async,
  ComponentFixture, fakeAsync,
  TestBed, tick
} from '@angular/core/testing';

import { NotificationModule } from 'patternfly-ng';

import { Che } from '../../codebases/services/che';
import { WorkspacesItemHeadingComponent } from './workspaces-item-heading.component';
import { WorkspacesNotificationModule } from '../../codebases/workspaces-notification/workspaces-notification.module';

@Component({
  template: `<workspaces-item-heading #workspacesItemHeading
                                      [cheState]="cheState"></workspaces-item-heading>`
})
class TestHostComponent {
  @ViewChild('workspacesItemHeading') workspacesItemHeading: WorkspacesItemHeadingComponent;

  cheState: Che = null;
}

describe(`WorkspacesItemHeadingComponent`, () => {

  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let workspacesItemHeadingComponent: WorkspacesItemHeadingComponent;
  let workspacesItemHeadingElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        CommonModule,
        NotificationModule,
        WorkspacesNotificationModule
      ],
      declarations: [
        TestHostComponent,
        WorkspacesItemHeadingComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;

    fixture.detectChanges();

    workspacesItemHeadingComponent = testHostComponent.workspacesItemHeading;
    workspacesItemHeadingElement = fixture.debugElement.query(By.css('.workspaces-item-heading'));
  });

  it(`should compile WorkspacesItemHeadingComponent`, () => {
    expect(workspacesItemHeadingElement)
      .toBeTruthy('workspaces-item-heading element is present in DOM');
  });

  it(`should show Che starting message`, () => {
    testHostComponent.cheState = { running: false } as Che;
    fixture.detectChanges();

    expect(workspacesItemHeadingComponent.getNotificationMessage())
      .toEqual(workspacesItemHeadingComponent.cheStartingMessage);
    expect(workspacesItemHeadingElement.nativeElement.textContent)
      .toContain(workspacesItemHeadingComponent.cheStartingMessage, 'starting message is shown');
  });

  it(`should show Che running message`, () => {
    testHostComponent.cheState = { running: true } as Che;
    fixture.detectChanges();

    expect(workspacesItemHeadingComponent.getNotificationMessage())
      .toEqual(workspacesItemHeadingComponent.cheRunningMessage);
    // expect(workspacesItemHeadingElement.nativeElement.textContent)
    //   .toContain(workspacesItemHeadingComponent.cheRunningMessage, 'running message is shown');
  });

});
