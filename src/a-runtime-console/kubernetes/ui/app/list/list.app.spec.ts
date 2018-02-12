/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { TreeModule } from 'angular2-tree-component';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { SlideOutPanelModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { EnvironmentRoutingModule } from '../../environment/environment-routing.module';
import { EnvironmentModule } from '../../environment/environment.module';
import { TestAppModule } from './../../../../app.test.module';
import { ConfigMapModule } from './../../configmap/configmap.module';
import { DeploymentModule } from './../../deployment/deployment.module';
import { EventModule } from './../../event/event.module';
import { PodModule } from './../../pod/pod.module';
import { ReplicaSetModule } from './../../replicaset/replicaset.module';
import { ServiceModule } from './../../service/service.module';
import { AppListPageComponent } from './../list-page/list-page.app.component';
import { AppListComponent } from './list.app.component';

xdescribe('AppListComponent', () => {
  let component: AppListComponent;
  let fixture: ComponentFixture<AppListComponent>;

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
        EnvironmentRoutingModule,
        DeploymentModule,
        ConfigMapModule,
        EventModule,
        PodModule,
        ReplicaSetModule,
        ServiceModule,
        SlideOutPanelModule,
        EnvironmentModule
      ],
      declarations: [
        AppListComponent,
        AppListPageComponent
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
    fixture = TestBed.createComponent(AppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
