/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BuildConfigsListToolbarComponent } from "./list-toolbar.buildconfig.component";
import { Fabric8CommonModule } from "../../../../common/common.module";

describe('BuildConfigsListToolbarComponent', () => {
  let component: BuildConfigsListToolbarComponent;
  let fixture: ComponentFixture<BuildConfigsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule
      ],
      declarations: [BuildConfigsListToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildConfigsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
