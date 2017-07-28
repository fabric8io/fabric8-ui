import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockBackend} from "@angular/http/testing";
import {RequestOptions, BaseRequestOptions, Http} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {DeploymentEditWrapperComponent} from "./edit-wrapper.deployment.component";
import {DeploymentEditToolbarComponent} from "../edit-toolbar/edit-toolbar.deployment.component";
import {DeploymentEditComponent} from "../edit/edit.deployment.component";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {MomentModule} from "angular2-moment";
import {ModalModule} from "ng2-modal";
import {FormsModule} from "@angular/forms";

describe('DeploymentEditWrapperComponent', () => {
  let deployment: DeploymentEditWrapperComponent;
  let fixture: ComponentFixture<DeploymentEditWrapperComponent>;

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
          DeploymentEditWrapperComponent,
          DeploymentEditToolbarComponent,
          DeploymentEditComponent,
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
    fixture = TestBed.createComponent(DeploymentEditWrapperComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(deployment).toBeTruthy(); });
});
