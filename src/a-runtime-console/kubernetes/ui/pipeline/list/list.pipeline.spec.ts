/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { BuildConfigService } from '../../../service/buildconfig.service';
import { PipelinesListComponent } from './list.pipeline.component';

describe('PipelinesListComponent', () => {
  let component: PipelinesListComponent;
  let fixture: ComponentFixture<PipelinesListComponent>;
  let mockBuildConfigService: any = jasmine.createSpy('BuildConfigService');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        MomentModule
      ],
      declarations: [
        PipelinesListComponent
      ],
      providers: [
        { provide: BuildConfigService, useVale: mockBuildConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
