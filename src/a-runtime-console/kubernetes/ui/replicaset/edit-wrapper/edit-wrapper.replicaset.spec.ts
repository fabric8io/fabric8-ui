import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { ReplicaSetEditWrapperComponent } from "./edit-wrapper.replicaset.component";
import { ReplicaSetEditToolbarComponent } from "../edit-toolbar/edit-toolbar.replicaset.component";
import { ReplicaSetEditComponent } from "../edit/edit.replicaset.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { MomentModule } from "angular2-moment";
import { ModalModule } from "ngx-modal";
import { FormsModule } from "@angular/forms";

describe('ReplicaSetEditWrapperComponent', () => {
  let replicaset: ReplicaSetEditWrapperComponent;
  let fixture: ComponentFixture<ReplicaSetEditWrapperComponent>;

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
          ReplicaSetEditWrapperComponent,
          ReplicaSetEditToolbarComponent,
          ReplicaSetEditComponent
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
    fixture = TestBed.createComponent(ReplicaSetEditWrapperComponent);
    replicaset = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(replicaset).toBeTruthy(); });
});
