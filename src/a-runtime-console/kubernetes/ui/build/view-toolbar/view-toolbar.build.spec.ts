/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BuildViewToolbarComponent } from "./view-toolbar.build.component";

describe('BuildViewToolbarComponent', () => {
  let build: BuildViewToolbarComponent;
  let fixture: ComponentFixture<BuildViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([]),
          ],
          declarations: [BuildViewToolbarComponent],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildViewToolbarComponent);
    build = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(build).toBeTruthy(); });
});
