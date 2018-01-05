import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { SpaceEditWrapperComponent } from "./edit-wrapper.space.component";
import { SpaceEditToolbarComponent } from "../edit-toolbar/edit-toolbar.space.component";
import { SpaceEditComponent } from "../edit/edit.space.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { MomentModule } from "angular2-moment";
import { ModalModule } from "ngx-modal";
import { FormsModule } from "@angular/forms";

describe('SpaceEditWrapperComponent', () => {
  let space: SpaceEditWrapperComponent;
  let fixture: ComponentFixture<SpaceEditWrapperComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          FormsModule,
          MomentModule,
          ModalModule,
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          SpaceEditWrapperComponent,
          SpaceEditToolbarComponent,
          SpaceEditComponent
        ],
        providers: [
          MockBackend,
          { provide: RequestOptions, useClass: BaseRequestOptions },
          {
            provide: Http, useFactory: (backend, options) => {
              return new Http(backend, options);
            }, deps: [MockBackend, RequestOptions]
          }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceEditWrapperComponent);
    space = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(space).toBeTruthy(); });
});
