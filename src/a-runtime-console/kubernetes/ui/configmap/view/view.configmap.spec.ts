import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, TestBed, ComponentFixture} from "@angular/core/testing";
import {ConfigMapViewComponent} from "./view.configmap.component";
import {MomentModule} from "angular2-moment";
import {ConfigMapDeleteDialog} from "../delete-dialog/delete-dialog.configmap.component";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {RestangularModule} from "ng2-restangular";
import {RouterTestingModule} from "@angular/router/testing";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('ConfigMapViewComponent', () => {
  let configmap: ConfigMapViewComponent;
  let fixture: ComponentFixture<ConfigMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          Fabric8CommonModule,
          FormsModule,
          MomentModule,
          ModalModule,
          RestangularModule.forRoot(),
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          ConfigMapViewComponent,
          ConfigMapDeleteDialog,
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
      },
    )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMapViewComponent);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(configmap).toBeTruthy();
  });
});
