/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PodEditComponent } from './edit.pod.component';

describe('PodEditComponent', () => {
  let pod: PodEditComponent;
  let fixture: ComponentFixture<PodEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        PodEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodEditComponent);
    pod = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(pod).toBeTruthy();
  });
});
