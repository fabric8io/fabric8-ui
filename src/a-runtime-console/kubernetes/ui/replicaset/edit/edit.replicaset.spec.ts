/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReplicaSetEditComponent } from './edit.replicaset.component';

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
