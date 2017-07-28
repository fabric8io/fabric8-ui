import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {ConfigMapViewPage} from "./view-page.configmap.component";
import {ConfigMapViewWrapperComponent} from "../view-wrapper/view-wrapper.configmap.component";
import {ConfigMapViewToolbarComponent} from "../view-toolbar/view-toolbar.configmap.component";
import {ConfigMapViewComponent} from "../view/view.configmap.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('ConfigMapViewPage', () => {
  let configmap: ConfigMapViewPage;
  let fixture: ComponentFixture<ConfigMapViewPage>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          Fabric8CommonModule,
          FormsModule,
          MomentModule,
          ModalModule,
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          ConfigMapViewPage,
          ConfigMapViewWrapperComponent,
          ConfigMapViewToolbarComponent,
          ConfigMapViewComponent,
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
    fixture = TestBed.createComponent(ConfigMapViewPage);
    configmap = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(configmap).toBeTruthy(); });
});
