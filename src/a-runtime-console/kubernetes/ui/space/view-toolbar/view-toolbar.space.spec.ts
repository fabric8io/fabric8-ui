/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {SpaceViewToolbarComponent} from "./view-toolbar.space.component";

describe('SpaceViewToolbarComponent', () => {
  let space: SpaceViewToolbarComponent;
  let fixture: ComponentFixture<SpaceViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([]),
          ],
          declarations: [SpaceViewToolbarComponent],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceViewToolbarComponent);
    space = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(space).toBeTruthy(); });
});
