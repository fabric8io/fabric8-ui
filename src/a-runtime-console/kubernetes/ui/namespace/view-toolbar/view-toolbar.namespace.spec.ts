/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NamespaceViewToolbarComponent } from "./view-toolbar.namespace.component";

describe('NamespaceViewToolbarComponent', () => {
  let namespace: NamespaceViewToolbarComponent;
  let fixture: ComponentFixture<NamespaceViewToolbarComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          imports: [
            RouterTestingModule.withRoutes([]),
          ],
          declarations: [NamespaceViewToolbarComponent],
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceViewToolbarComponent);
    namespace = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(namespace).toBeTruthy(); });
});
