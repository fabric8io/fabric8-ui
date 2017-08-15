import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {NamespaceViewPage} from "./view-page.namespace.component";
import {NamespaceViewWrapperComponent} from "../view-wrapper/view-wrapper.namespace.component";
import {NamespaceViewToolbarComponent} from "../view-toolbar/view-toolbar.namespace.component";
import {NamespaceViewComponent} from "../view/view.namespace.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('NamespaceViewPage', () => {
  let namespace: NamespaceViewPage;
  let fixture: ComponentFixture<NamespaceViewPage>;

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
          NamespaceViewPage,
          NamespaceViewWrapperComponent,
          NamespaceViewToolbarComponent,
          NamespaceViewComponent,
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
    fixture = TestBed.createComponent(NamespaceViewPage);
    namespace = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(namespace).toBeTruthy(); });
});
