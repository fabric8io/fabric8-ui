/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { BuildConfigStore } from '../../../store/buildconfig.store';
import { PipelineViewPage } from './view-page.pipeline.component';

describe('PipelineViewPage', () => {
  let pipeline: PipelineViewPage;
  let fixture: ComponentFixture<PipelineViewPage>;

  beforeEach(async(() => {
    let mockBuildConfigStore: any = jasmine.createSpy('BuildConfigService');
    mockBuildConfigStore.load = () => {};
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), MomentModule],
      declarations: [PipelineViewPage],
      providers: [{ provide: BuildConfigStore, useValue: mockBuildConfigStore }],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineViewPage);
    pipeline = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(pipeline).toBeTruthy();
  });
});
