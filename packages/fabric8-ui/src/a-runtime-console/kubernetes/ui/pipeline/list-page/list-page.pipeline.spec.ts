/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { empty as observableEmpty, Observable, of as observableOf } from 'rxjs';
import { APIsStore } from '../../../store/apis.store';
import { BuildStore } from '../../../store/build.store';
import { BuildConfigStore } from '../../../store/buildconfig.store';
import { PipelinesListPage } from './list-page.pipeline.component';

describe('PipelinesListPage', () => {
  let component: PipelinesListPage;
  let fixture: ComponentFixture<PipelinesListPage>;

  beforeEach(async(() => {
    const mockBuildConfigStore: any = jasmine.createSpy('BuildConfigService');
    mockBuildConfigStore.loading = observableOf(false);
    mockBuildConfigStore.list = observableEmpty();
    const mockBuildStore: any = jasmine.createSpy('BuildStore');
    mockBuildStore.loading = observableOf(true);
    mockBuildStore.list = observableEmpty();
    const mockAPIsStore: any = jasmine.createSpyObj('APIsStore', ['load']);
    mockAPIsStore.loading = observableEmpty();
    TestBed.configureTestingModule({
      declarations: [PipelinesListPage],
      providers: [
        { provide: BuildConfigStore, useValue: mockBuildConfigStore },
        { provide: BuildStore, useValue: mockBuildStore },
        { provide: APIsStore, useValue: mockAPIsStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
