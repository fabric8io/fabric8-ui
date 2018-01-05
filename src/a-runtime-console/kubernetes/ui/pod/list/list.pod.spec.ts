import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PodsListComponent } from "./list.pod.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { RouterTestingModule } from "@angular/router/testing";
import { MomentModule } from "angular2-moment";
import { PodDeleteDialog } from "../delete-dialog/delete-dialog.pod.component";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { FormsModule } from "@angular/forms";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { MockBackend } from "@angular/http/testing";
import { KubernetesComponentsModule } from "../../../components/components.module";

describe('PodsListComponent', () => {
  let component: PodsListComponent;
  let fixture: ComponentFixture<PodsListComponent>;

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
        PodsListComponent,
        PodDeleteDialog
      ],
      providers: [
        MockBackend,
        { provide: RequestOptions, useClass: BaseRequestOptions },
        {
          provide: Http, useFactory: (backend, options) => {
            return new Http(backend, options);
          }, deps: [MockBackend, RequestOptions]
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
