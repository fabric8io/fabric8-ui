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
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { DeploymentDeleteDialog } from '../delete-dialog/delete-dialog.deployment.component';
import { DeploymentScaleDialog } from '../scale-dialog/scale-dialog.deployment.component';
import { DeploymentViewToolbarComponent } from '../view-toolbar/view-toolbar.deployment.component';
import { DeploymentViewComponent } from '../view/view.deployment.component';
import { TestAppModule } from './../../../../app.test.module';
import { DeploymentViewWrapperComponent } from './view-wrapper.deployment.component';

describe('DeploymentViewWrapperComponent', () => {
  let deployment: DeploymentViewWrapperComponent;
  let fixture: ComponentFixture<DeploymentViewWrapperComponent>;

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          Fabric8CommonModule,
          FormsModule,
          MomentModule,
          ModalModule,
          RouterTestingModule.withRoutes([]),
          RestangularModule.forRoot(),
          KubernetesStoreModule,
          TestAppModule
        ],
        declarations: [
          DeploymentViewWrapperComponent,
          DeploymentViewToolbarComponent,
          DeploymentViewComponent,
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
    fixture = TestBed.createComponent(DeploymentViewWrapperComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(deployment).toBeTruthy(); });
});
