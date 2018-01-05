import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBackend } from "@angular/http/testing";
import { RequestOptions, BaseRequestOptions, Http } from "@angular/http";
import { RestangularModule } from "ng2-restangular";
import { PodsListPage } from "./list-page.pod.component";
import { PodsListComponent } from "../list/list.pod.component";
import { PodsListToolbarComponent } from "../list-toolbar/list-toolbar.pod.component";
import { Fabric8CommonModule } from "../../../../common/common.module";
import { KubernetesStoreModule } from "../../../kubernetes.store.module";
import { ModalModule } from "ngx-modal";
import { MomentModule } from "angular2-moment";
import { PodDeleteDialog } from "../delete-dialog/delete-dialog.pod.component";
import { FormsModule } from "@angular/forms";
import { KubernetesComponentsModule } from "../../../components/components.module";

describe('PodsListPage', () => {
  let component: PodsListPage;
  let fixture: ComponentFixture<PodsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        FormsModule,
        MomentModule,
        ModalModule,
        KubernetesStoreModule,
        KubernetesComponentsModule,
        TestAppModule
      ],
      declarations: [
        PodsListPage,
        PodsListComponent,
        PodsListToolbarComponent,
        PodDeleteDialog,
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
    fixture = TestBed.createComponent(PodsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
