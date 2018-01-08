/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { PipelinesFullHistoryToolbarComponent } from './full-history-toolbar.pipeline.component';

describe('PipelinesFullHistoryToolbarComponent', () => {
  let component: PipelinesFullHistoryToolbarComponent;
  let fixture: ComponentFixture<PipelinesFullHistoryToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule
      ],
      declarations: [PipelinesFullHistoryToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesFullHistoryToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
