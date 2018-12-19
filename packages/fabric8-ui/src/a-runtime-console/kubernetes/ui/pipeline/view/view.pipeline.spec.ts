/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { PipelineViewComponent } from './view.pipeline.component';

describe('PipelineViewComponent', () => {
  let pipeline: PipelineViewComponent;
  let fixture: ComponentFixture<PipelineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule, Fabric8CommonModule],
      declarations: [PipelineViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(pipeline).toBeTruthy();
  });
});
