/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ReplicaSetsListToolbarComponent} from "./list-toolbar.replicaset.component";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('ReplicaSetsListToolbarComponent', () => {
  let component: ReplicaSetsListToolbarComponent;
  let fixture: ComponentFixture<ReplicaSetsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule,
      ],
      declarations: [ReplicaSetsListToolbarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
