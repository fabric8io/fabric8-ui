import {AppListToolbarComponent} from "./../list-toolbar/list-toolbar.app.component";
import {AppListPageComponent} from "./../list-page/list-page.app.component";
import {ServiceModule} from "./../../service/service.module";
import {ReplicaSetModule} from "./../../replicaset/replicaset.module";
import {PodModule} from "./../../pod/pod.module";
import {EventModule} from "./../../event/event.module";
import {ConfigMapModule} from "./../../configmap/configmap.module";
import {DeploymentModule} from "./../../deployment/deployment.module";
import {TreeModule} from "angular2-tree-component";
import {SlideOutPanelModule, TreeListModule} from "ngx-widgets";
import {TestAppModule} from "./../../../../app.test.module";
/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AppListComponent} from "./list.app.component";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {RouterTestingModule} from "@angular/router/testing";
import {MomentModule} from "angular2-moment";
import {KubernetesStoreModule} from "../../../kubernetes.store.module";
import {ModalModule} from "ngx-modal";
import {FormsModule} from "@angular/forms";
import {BaseRequestOptions, Http, RequestOptions} from "@angular/http";
import {RestangularModule} from "ng2-restangular";
import {MockBackend} from "@angular/http/testing";
import {KubernetesComponentsModule} from "../../../components/components.module";
import {EnvironmentRoutingModule} from "../../environment/environment-routing.module";
import {EnvironmentModule} from "../../environment/environment.module";

describe('AppListComponent', () => {
  let component: AppListComponent;
  let fixture: ComponentFixture<AppListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        Fabric8CommonModule,
        FormsModule,
        MomentModule,
        ModalModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        KubernetesStoreModule,
        KubernetesComponentsModule,
        TestAppModule,
        TreeListModule,
        TreeModule,
        EnvironmentRoutingModule,
        DeploymentModule,
        ConfigMapModule,
        EventModule,
        PodModule,
        ReplicaSetModule,
        ServiceModule,
        SlideOutPanelModule,
        EnvironmentModule,
      ],
      declarations: [
        AppListComponent,
        AppListPageComponent,
        AppListToolbarComponent,
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
    fixture = TestBed.createComponent(AppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
