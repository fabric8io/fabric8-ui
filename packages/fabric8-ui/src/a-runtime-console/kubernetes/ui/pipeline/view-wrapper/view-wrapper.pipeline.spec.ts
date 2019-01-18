/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of as observableOf } from 'rxjs';
import { BuildConfigStore } from '../../../store/buildconfig.store';
import { PipelineViewWrapperComponent } from './view-wrapper.pipeline.component';

describe('PipelineViewWrapperComponent', () => {
  let pipeline: PipelineViewWrapperComponent;
  let fixture: ComponentFixture<PipelineViewWrapperComponent>;

  beforeEach(async(() => {
    let mockBuildConfigStore: any = jasmine.createSpy('BuildConfigService');
    mockBuildConfigStore.resource = observableOf({});
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PipelineViewWrapperComponent],
      providers: [{ provide: BuildConfigStore, useValue: mockBuildConfigStore }],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewWrapperComponent);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(pipeline).toBeTruthy();
  });
});
