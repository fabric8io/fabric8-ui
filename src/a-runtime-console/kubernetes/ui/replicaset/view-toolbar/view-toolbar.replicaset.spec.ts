/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReplicaSetViewToolbarComponent } from "./view-toolbar.replicaset.component";

describe('ReplicaSetViewToolbarComponent', () => {
  let replicaset: ReplicaSetViewToolbarComponent;
  let fixture: ComponentFixture<ReplicaSetViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([]),
          ],
          declarations: [ReplicaSetViewToolbarComponent],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetViewToolbarComponent);
    replicaset = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(replicaset).toBeTruthy(); });
});
