/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ConfigMapsListToolbarComponent} from "./list-toolbar.configmap.component";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('ConfigMapsListToolbarComponent', () => {
  let component: ConfigMapsListToolbarComponent;
  let fixture: ComponentFixture<ConfigMapsListToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule,
      ],
      declarations: [ConfigMapsListToolbarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
