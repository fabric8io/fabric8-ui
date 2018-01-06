import { SpaceNamespaceService } from '../../../service/space-namespace.service';
import { NoNotifications } from './../../../../shared/no-notifications.service';
import { Notifications } from 'ngx-base';
import { SpaceNamespace } from '../../../model/space-namespace';
import { EnvironmentDetailComponent } from './../detail/detail.environment.component';
import { ServiceModule } from './../../service/service.module';
import { ReplicaSetModule } from './../../replicaset/replicaset.module';
import { PodModule } from './../../pod/pod.module';
import { EventModule } from './../../event/event.module';
import { ConfigMapModule } from './../../configmap/configmap.module';
import { DeploymentModule } from './../../deployment/deployment.module';
import { EnvironmentRoutingModule } from './../environment-routing.module';
import { TreeModule } from 'angular2-tree-component';
import { SlideOutPanelModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng';
import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { RestangularModule } from 'ng2-restangular';
import { EnvironmentListPageComponent } from './list-page.environment.component';
import { EnvironmentListComponent } from '../list/list.environment.component';
import { EnvironmentListToolbarComponent } from '../list-toolbar/list-toolbar.environment.component';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { ModalModule } from 'ngx-modal';
import { MomentModule } from 'angular2-moment';
import { FormsModule } from '@angular/forms';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { TabsModule } from 'ngx-bootstrap';

xdescribe('EnvironmentListPage', () => {
  let component: EnvironmentListPageComponent;
  let fixture: ComponentFixture<EnvironmentListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionModule,
        Fabric8CommonModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
        FormsModule,
        MomentModule,
        ModalModule,
        KubernetesStoreModule,
        KubernetesComponentsModule,
        TestAppModule,
        TreeModule,
        TabsModule.forRoot(),
        EnvironmentRoutingModule,
        DeploymentModule,
        ConfigMapModule,
        EventModule,
        PodModule,
        ReplicaSetModule,
        ServiceModule,
        SlideOutPanelModule
      ],
      declarations: [
        EnvironmentListPageComponent,
        EnvironmentListComponent,
        EnvironmentListToolbarComponent,
        EnvironmentDetailComponent
      ],
      providers: [
        {
          provide: SpaceNamespace,
          useClass: SpaceNamespaceService
        },
        {
          provide: Notifications,
          useClass: NoNotifications
        },
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
    fixture = TestBed.createComponent(EnvironmentListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
