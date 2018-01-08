/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DeploymentEditComponent } from './edit.deployment.component';

describe('DeploymentEditComponent', () => {
  let deployment: DeploymentEditComponent;
  let fixture: ComponentFixture<DeploymentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        DeploymentEditComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentEditComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(deployment).toBeTruthy();
  });
});
