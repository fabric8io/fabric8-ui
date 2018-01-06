/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplicaSetEditComponent } from './edit.replicaset.component';
import { FormsModule } from '@angular/forms';

describe('ReplicaSetEditComponent', () => {
  let replicaset: ReplicaSetEditComponent;
  let fixture: ComponentFixture<ReplicaSetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ReplicaSetEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetEditComponent);
    replicaset = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(replicaset).toBeTruthy();
  });
});
