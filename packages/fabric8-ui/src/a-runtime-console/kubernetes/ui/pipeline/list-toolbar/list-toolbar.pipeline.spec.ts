/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipelinesListToolbarComponent } from './list-toolbar.pipeline.component';

describe('PipelinesListToolbarComponent', () => {
  let component: PipelinesListToolbarComponent;
  let fixture: ComponentFixture<PipelinesListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PipelinesListToolbarComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
