/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { PipelinesListToolbarComponent } from "./list-toolbar.pipeline.component";
import { Fabric8CommonModule } from "../../../../common/common.module";

describe('PipelinesListToolbarComponent', () => {
  let component: PipelinesListToolbarComponent;
  let fixture: ComponentFixture<PipelinesListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule,
      ],
      declarations: [PipelinesListToolbarComponent],
    })
      .compileComponents();
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
