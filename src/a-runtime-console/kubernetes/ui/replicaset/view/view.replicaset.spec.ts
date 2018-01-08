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
import { ReplicaSetDeleteDialog } from '../delete-dialog/delete-dialog.replicaset.component';
import { ReplicaSetScaleDialog } from '../scale-dialog/scale-dialog.replicaset.component';
import { TestAppModule } from './../../../../app.test.module';
import { ReplicaSetViewComponent } from './view.replicaset.component';

describe('ReplicaSetViewComponent', () => {
  let replicaset: ReplicaSetViewComponent;
  let fixture: ComponentFixture<ReplicaSetViewComponent>;

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
          ReplicaSetViewComponent,
          ReplicaSetDeleteDialog,
          ReplicaSetScaleDialog
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
    fixture = TestBed.createComponent(ReplicaSetViewComponent);
    replicaset = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(replicaset).toBeTruthy();
  });
});
