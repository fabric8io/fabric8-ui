/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {EnvironmentListToolbarComponent} from "./list-toolbar.environment.component";

describe('EnvironmentListToolbarComponent', () => {
  let component: EnvironmentListToolbarComponent;
  let fixture: ComponentFixture<EnvironmentListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [EnvironmentListToolbarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
