import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {BuildViewPage} from "./view-page.build.component";
import {BuildViewWrapperComponent} from "../view-wrapper/view-wrapper.build.component";
import {BuildViewToolbarComponent} from "../view-toolbar/view-toolbar.build.component";
import {BuildViewComponent} from "../view/view.build.component";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {Fabric8CommonModule} from "../../../../common/common.module";

describe('BuildViewPage', () => {
  let build: BuildViewPage;
  let fixture: ComponentFixture<BuildViewPage>;

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
          BuildViewPage,
          BuildViewWrapperComponent,
          BuildViewToolbarComponent,
          BuildViewComponent,
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
    fixture = TestBed.createComponent(BuildViewPage);
    build = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(build).toBeTruthy(); });
});
