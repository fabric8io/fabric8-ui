import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { SpaceEditPage } from "./edit-page.space.component";
import { SpaceEditWrapperComponent } from "../edit-wrapper/edit-wrapper.space.component";
import { SpaceEditToolbarComponent } from "../edit-toolbar/edit-toolbar.space.component";
import { SpaceEditComponent } from "../edit/edit.space.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { FormsModule } from "@angular/forms";


describe('SpaceEditPage', () => {
  let space: SpaceEditPage;
  let fixture: ComponentFixture<SpaceEditPage>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          SpaceEditPage,
          SpaceEditWrapperComponent,
          SpaceEditToolbarComponent,
          SpaceEditComponent,
        ],
        providers: [
          MockBackend,
          { provide: RequestOptions, useClass: BaseRequestOptions },
          {
            provide: Http, useFactory: (backend, options) => {
              return new Http(backend, options);
            }, deps: [MockBackend, RequestOptions],
          },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEditPage);
    space = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(space).toBeTruthy(); });
});
