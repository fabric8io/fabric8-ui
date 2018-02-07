/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { TreeModule } from 'angular2-tree-component';
import { RestangularModule } from 'ng2-restangular';
import { TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { SlideOutPanelModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { TestAppModule } from './../../../../app.test.module';
import { ConfigMapModule } from './../../configmap/configmap.module';
import { DeploymentModule } from './../../deployment/deployment.module';
import { EventModule } from './../../event/event.module';
import { PodModule } from './../../pod/pod.module';
import { ReplicaSetModule } from './../../replicaset/replicaset.module';
import { ServiceModule } from './../../service/service.module';
import { EnvironmentDetailComponent } from './../detail/detail.environment.component';
import { EnvironmentRoutingModule } from './../environment-routing.module';
import { EnvironmentListPageComponent } from './../list-page/list-page.environment.component';
import { EnvironmentListToolbarComponent } from './../list-toolbar/list-toolbar.environment.component';
import { EnvironmentListComponent } from './list.environment.component';

xdescribe('EnvironmentListComponent', () => {
  let component: EnvironmentListComponent;
  let fixture: ComponentFixture<EnvironmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ActionModule,
        Fabric8CommonModule,
        FormsModule,
        MomentModule,
        ModalModule,
        RouterTestingModule.withRoutes([]),
        RestangularModule.forRoot(),
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
        EnvironmentListComponent,
        EnvironmentListPageComponent,
        EnvironmentDetailComponent,
        EnvironmentListToolbarComponent
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
    fixture = TestBed.createComponent(EnvironmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
