import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { DeploymentViewPage } from "./view-page.deployment.component";
import { DeploymentViewWrapperComponent } from "../view-wrapper/view-wrapper.deployment.component";
import { DeploymentViewToolbarComponent } from "../view-toolbar/view-toolbar.deployment.component";
import { DeploymentViewComponent } from "../view/view.deployment.component";
import { MomentModule } from "angular2-moment";
import { DeploymentScaleDialog } from "../scale-dialog/scale-dialog.deployment.component";
import { ModalModule } from "ngx-modal";
import { FormsModule } from "@angular/forms";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { Fabric8CommonModule } from "../../../../common/common.module";

describe('DeploymentViewPage', () => {
  let deployment: DeploymentViewPage;
  let fixture: ComponentFixture<DeploymentViewPage>;

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
          DeploymentViewPage,
          DeploymentViewWrapperComponent,
          DeploymentViewToolbarComponent,
          DeploymentViewComponent,
          DeploymentScaleDialog,
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
    fixture = TestBed.createComponent(DeploymentViewPage);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(deployment).toBeTruthy(); });
});
