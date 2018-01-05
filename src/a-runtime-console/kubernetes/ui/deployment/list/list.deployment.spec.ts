import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DeploymentsListComponent } from "./list.deployment.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { RouterTestingModule } from "@angular/router/testing";
import { MomentModule } from "angular2-moment";
import { DeploymentDeleteDialog } from "../delete-dialog/delete-dialog.deployment.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { DeploymentScaleDialog } from "../scale-dialog/scale-dialog.deployment.component";
import { FormsModule } from "@angular/forms";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { MockBackend } from "@angular/http/testing";
import { KubernetesComponentsModule } from "../../../components/components.module";

describe('DeploymentsListComponent', () => {
  let component: DeploymentsListComponent;
  let fixture: ComponentFixture<DeploymentsListComponent>;

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
        KubernetesComponentsModule,
        TestAppModule
      ],
      declarations: [
        DeploymentsListComponent,
        DeploymentDeleteDialog,
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
    fixture = TestBed.createComponent(DeploymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
