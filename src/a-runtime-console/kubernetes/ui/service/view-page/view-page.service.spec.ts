import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {ServiceViewPage} from "./view-page.service.component";
import {ServiceViewWrapperComponent} from "../view-wrapper/view-wrapper.service.component";
import {ServiceViewToolbarComponent} from "../view-toolbar/view-toolbar.service.component";
import {ServiceViewComponent} from "../view/view.service.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('ServiceViewPage', () => {
  let service: ServiceViewPage;
  let fixture: ComponentFixture<ServiceViewPage>;

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
          ServiceViewPage,
          ServiceViewWrapperComponent,
          ServiceViewToolbarComponent,
          ServiceViewComponent,
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
    fixture = TestBed.createComponent(ServiceViewPage);
    service = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(service).toBeTruthy(); });
});
