/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ng2-restangular';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../../common/common.module';
import { KubernetesComponentsModule } from '../../../components/components.module';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { DeploymentDeleteDialog } from '../delete-dialog/delete-dialog.deployment.component';
import { DeploymentsListToolbarComponent } from '../list-toolbar/list-toolbar.deployment.component';
import { DeploymentsListComponent } from '../list/list.deployment.component';
import { DeploymentScaleDialog } from '../scale-dialog/scale-dialog.deployment.component';
import { TestAppModule } from './../../../../app.test.module';
import { DeploymentsListPage } from './list-page.deployment.component';

describe('DeploymentsListPage', () => {
  let component: DeploymentsListPage;
  let fixture: ComponentFixture<DeploymentsListPage>;

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
        DeploymentsListPage,
        DeploymentsListComponent,
        DeploymentsListToolbarComponent,
        DeploymentDeleteDialog,
        DeploymentScaleDialog
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
    fixture = TestBed.createComponent(DeploymentsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
