/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { BuildStageViewComponent } from '../build-stage-view/build-stage-view.component';
import { StageTimePipe } from '../build-stage-view/stage-time.pipe';
import { InputActionDialog } from '../input-action-dialog/input-action-dialog.component';
import { PipelinesFullHistoryComponent } from './full-history.pipeline.component';

describe('PipelinesFullHistoryComponent', () => {
  let component: PipelinesFullHistoryComponent;
  let fixture: ComponentFixture<PipelinesFullHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MomentModule
      ],
      declarations: [
        BuildStageViewComponent,
        InputActionDialog,
        PipelinesFullHistoryComponent,
        StageTimePipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesFullHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
