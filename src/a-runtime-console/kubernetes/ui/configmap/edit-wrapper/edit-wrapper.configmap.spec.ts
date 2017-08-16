import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {ConfigMapEditWrapperComponent} from "./edit-wrapper.configmap.component";
import {ConfigMapEditToolbarComponent} from "../edit-toolbar/edit-toolbar.configmap.component";
import {ConfigMapEditComponent} from "../edit/edit.configmap.component";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";

describe('ConfigMapEditWrapperComponent', () => {
  let configmap: ConfigMapEditWrapperComponent;
  let fixture: ComponentFixture<ConfigMapEditWrapperComponent>;

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
          ConfigMapEditWrapperComponent,
          ConfigMapEditToolbarComponent,
          ConfigMapEditComponent,
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
    fixture = TestBed.createComponent(ConfigMapEditWrapperComponent);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(configmap).toBeTruthy(); });
});
