import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReplicaSetsListComponent } from "./list.replicaset.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { RouterTestingModule } from "@angular/router/testing";
import { MomentModule } from "angular2-moment";
import { ReplicaSetDeleteDialog } from "../delete-dialog/delete-dialog.replicaset.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { ReplicaSetScaleDialog } from "../scale-dialog/scale-dialog.replicaset.component";
import { FormsModule } from "@angular/forms";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { MockBackend } from "@angular/http/testing";
import { KubernetesComponentsModule } from "../../../components/components.module";

describe('ReplicaSetsListComponent', () => {
  let component: ReplicaSetsListComponent;
  let fixture: ComponentFixture<ReplicaSetsListComponent>;

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
        ReplicaSetsListComponent,
        ReplicaSetDeleteDialog,
        ReplicaSetScaleDialog,
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
    fixture = TestBed.createComponent(ReplicaSetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
