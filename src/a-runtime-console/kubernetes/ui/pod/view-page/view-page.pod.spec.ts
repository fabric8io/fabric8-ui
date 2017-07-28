import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {PodViewPage} from "./view-page.pod.component";
import {PodViewWrapperComponent} from "../view-wrapper/view-wrapper.pod.component";
import {PodViewToolbarComponent} from "../view-toolbar/view-toolbar.pod.component";
import {PodViewComponent} from "../view/view.pod.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {KubernetesComponentsModule} from "../../../components/components.module";

describe('PodViewPage', () => {
  let pod: PodViewPage;
  let fixture: ComponentFixture<PodViewPage>;

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
          KubernetesComponentsModule,
          TestAppModule
        ],
        declarations: [
          PodViewPage,
          PodViewWrapperComponent,
          PodViewToolbarComponent,
          PodViewComponent,
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
    fixture = TestBed.createComponent(PodViewPage);
    pod = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(pod).toBeTruthy(); });
});
