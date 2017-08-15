import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {BuildConfigViewPage} from "./view-page.buildconfig.component";
import {BuildConfigViewWrapperComponent} from "../view-wrapper/view-wrapper.buildconfig.component";
import {BuildConfigViewToolbarComponent} from "../view-toolbar/view-toolbar.buildconfig.component";
import {BuildConfigViewComponent} from "../view/view.buildconfig.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('BuildConfigViewPage', () => {
  let buildconfig: BuildConfigViewPage;
  let fixture: ComponentFixture<BuildConfigViewPage>;

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
          BuildConfigViewPage,
          BuildConfigViewWrapperComponent,
          BuildConfigViewToolbarComponent,
          BuildConfigViewComponent,
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
    fixture = TestBed.createComponent(BuildConfigViewPage);
    buildconfig = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(buildconfig).toBeTruthy(); });
});
