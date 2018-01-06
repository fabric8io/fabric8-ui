import { TestAppModule } from './../../../../app.test.module';
/* tslint:disable:no-unused-variable */
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { DeploymentViewComponent } from './view.deployment.component';
import { MomentModule } from 'angular2-moment';
import { DeploymentScaleDialog } from '../scale-dialog/scale-dialog.deployment.component';
import { DeploymentDeleteDialog } from '../delete-dialog/delete-dialog.deployment.component';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';
import { KubernetesStoreModule } from '../../../kubernetes.store.module';
import { RequestOptions, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RestangularModule } from 'ng2-restangular';
import { RouterTestingModule } from '@angular/router/testing';
import { Fabric8CommonModule } from '../../../../common/common.module';

describe('DeploymentViewComponent', () => {
  let deployment: DeploymentViewComponent;
  let fixture: ComponentFixture<DeploymentViewComponent>;

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
          TestAppModule
        ],
        declarations: [
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
      }
    )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentViewComponent);
    deployment = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(deployment).toBeTruthy();
  });
});
