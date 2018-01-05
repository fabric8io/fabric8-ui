/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DeploymentViewToolbarComponent } from "./view-toolbar.deployment.component";

describe('DeploymentViewToolbarComponent', () => {
  let deployment: DeploymentViewToolbarComponent;
  let fixture: ComponentFixture<DeploymentViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([])
          ],
          declarations: [DeploymentViewToolbarComponent]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentViewToolbarComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(deployment).toBeTruthy(); });
});
