/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DeploymentsListToolbarComponent } from "./list-toolbar.deployment.component";
import { Fabric8CommonModule } from "../../../../common/common.module";

describe('DeploymentsListToolbarComponent', () => {
  let component: DeploymentsListToolbarComponent;
  let fixture: ComponentFixture<DeploymentsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule
      ],
      declarations: [DeploymentsListToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
