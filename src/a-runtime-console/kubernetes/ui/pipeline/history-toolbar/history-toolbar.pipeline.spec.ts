/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PipelinesHistoryToolbarComponent} from "./history-toolbar.pipeline.component";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('PipelinesHistoryToolbarComponent', () => {
  let component: PipelinesHistoryToolbarComponent;
  let fixture: ComponentFixture<PipelinesHistoryToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        Fabric8CommonModule,
      ],
      declarations: [PipelinesHistoryToolbarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinesHistoryToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
